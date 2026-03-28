/**
 * Nour Theme — MAHAM EXPO Luxury Design System
 * Reusable utility classes and color tokens for consistent styling
 */

export const nourTheme = {
  // Card backgrounds with Nour Theme glassmorphism
  cardBg: (isDark: boolean) => isDark
    ? 'bg-[#24221E]/70 backdrop-blur-md border-[#3F341C]/50 hover:border-[#987012]/30'
    : 'bg-white border-[#F0EEE7] hover:border-[#987012]/25 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_0_15px_rgba(152,112,18,0.15)]',

  // Glass panel for special sections
  glassPanelGold: (isDark: boolean) => isDark
    ? 'bg-gradient-to-br from-[#987012]/10 to-transparent backdrop-blur-md border-[#987012]/30'
    : 'bg-gradient-to-br from-[#987012]/5 to-transparent backdrop-blur-md border-[#987012]/20',

  // Text colors
  textPrimary: (isDark: boolean) => isDark ? 'text-white' : 'text-[#010101]',
  textSecondary: (isDark: boolean) => isDark ? 'text-[#A0A0A0]' : 'text-[#565656]',
  textTertiary: (isDark: boolean) => isDark ? 'text-[#6B6B6B]' : 'text-[#919187]',

  // Surface backgrounds
  surfaceBg: (isDark: boolean) => isDark ? 'bg-[#24221E]' : 'bg-[#F9F8F5]',
  surfaceHover: (isDark: boolean) => isDark ? 'hover:bg-[#24221E]/80' : 'hover:bg-[#F9F8F5]',

  // Border colors
  border: (isDark: boolean) => isDark ? 'border-[#3F341C]' : 'border-[#F0EEE7]',
  borderGold: (isDark: boolean) => isDark ? 'border-[#987012]/30' : 'border-[#987012]/20',

  // Gold accent
  goldText: (isDark: boolean) => isDark ? 'text-[#d4b85a]' : 'text-[#987012]',
  goldBg: (isDark: boolean) => isDark ? 'bg-[#987012]/10' : 'bg-[#987012]/5',

  // Shadows
  shadowSoft: '0 4px 20px rgba(0, 0, 0, 0.05)',
  shadowGlass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
  shadowGoldGlow: '0 0 15px rgba(152, 112, 18, 0.3)',

  // Status badges (Nour Theme semantic colors)
  statusBadge: (status: string, isDark: boolean) => {
    const styles: Record<string, string> = {
      success: isDark
        ? 'bg-[#1EB74C]/15 text-[#1EB74C] border border-[#1EB74C]/30'
        : 'bg-[#DBE5DE] text-[#1EB74C] border border-[#B5D2C1]',
      error: isDark
        ? 'bg-[#F53D6B]/15 text-[#F53D6B] border border-[#F53D6B]/30'
        : 'bg-[#F9E5EA] text-[#F53D6B] border border-[#F8DADF]',
      warning: isDark
        ? 'bg-[#FFC233]/15 text-[#FFC233] border border-[#FFC233]/30'
        : 'bg-[#F9F4E5] text-[#FFC233] border border-[#FFC233]/30',
      active: isDark
        ? 'bg-[#987012]/15 text-[#d4b85a] border border-[#987012]/30'
        : 'bg-[#987012]/8 text-[#987012] border border-[#987012]/20',
      pending: isDark
        ? 'bg-[#FFC233]/15 text-[#FFC233] border border-[#FFC233]/30'
        : 'bg-[#F9F4E5] text-[#FFC233] border border-[#FFC233]/30',
    };
    return styles[status] || styles.active;
  },

  // Input styling
  input: (isDark: boolean) => isDark
    ? 'bg-transparent border-[#3F341C] text-white placeholder:text-[#6B6B6B] focus:border-[#987012] focus:ring-2 focus:ring-[#987012]/20'
    : 'bg-transparent border-[#F0EEE7] text-[#010101] placeholder:text-[#919187] focus:border-[#987012] focus:ring-2 focus:ring-[#987012]/20',

  // Button primary (gold gradient)
  btnPrimary: 'bg-gradient-to-r from-[#987012] to-[#d4a832] text-white font-semibold hover:shadow-[0_0_15px_rgba(152,112,18,0.3)] active:scale-95 transition-all duration-300',

  // Button secondary (gold outline)
  btnSecondary: (isDark: boolean) => isDark
    ? 'border border-[#987012]/30 text-[#d4b85a] hover:bg-[#987012]/10 transition-all duration-300'
    : 'border border-[#987012]/30 text-[#987012] hover:bg-[#987012]/5 transition-all duration-300',
};
