/**
 * PageHeader — Nour Theme (MAHAM EXPO Luxury Design System)
 * Glassmorphism header with gold accents and background image
 */
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  image: string;
  badge?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, image, badge, children }: PageHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`relative rounded-xl overflow-hidden mb-4 sm:mb-6 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.98]'
      }`}
      style={{
        border: isDark ? '1px solid rgba(63, 52, 28, 0.3)' : '1px solid #F0EEE7',
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.37)'
          : '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out ${
            isVisible ? 'scale-100' : 'scale-110'
          }`}
          loading="eager"
        />
        {/* Nour Theme: Dark overlay with gold tint */}
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-t from-[#181715] via-[#181715]/80 to-[#181715]/40'
            : 'bg-gradient-to-t from-[#3F341C]/90 via-[#3F341C]/65 to-[#3F341C]/30'
        }`} />
      </div>

      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-20"
        style={{
          background: 'linear-gradient(90deg, transparent, #987012, transparent)',
          opacity: 0.6,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-8 min-h-[140px] sm:min-h-[180px] flex flex-col justify-end">
        {badge && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold w-fit mb-2 sm:mb-3"
            style={{
              background: 'rgba(152, 112, 18, 0.2)',
              color: '#e6b830',
              border: '1px solid rgba(152, 112, 18, 0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {badge}
          </span>
        )}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-['Cairo'] mb-1 sm:mb-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm max-w-2xl text-white/75">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
