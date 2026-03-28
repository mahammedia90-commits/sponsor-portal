/**
 * BrandAssets — Brand Asset Management & Upload
 * Upload logos, guidelines, artwork, video ads, booth branding files
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Upload, FileImage, FileVideo, FileText, File, CheckCircle,
  Clock, AlertCircle, X, Eye, Download, Trash2, Plus,
  Image, Film, Palette, BookOpen, Printer, Monitor, Bot
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

interface BrandFile {
  id: string;
  name: string;
  type: string;
  size: string;
  category: { ar: string; en: string };
  status: 'approved' | 'pending' | 'rejected' | 'required';
  uploadDate?: string;
  deadline: string;
  feedback?: { ar: string; en: string };
  specs: { ar: string; en: string };
}

const brandFiles: BrandFile[] = [
  { id: 'BF-001', name: 'company_logo_primary.svg', type: 'image/svg+xml', size: '245 KB', category: { ar: 'الشعار الرئيسي', en: 'Primary Logo' }, status: 'approved', uploadDate: '2026-02-15', deadline: '2026-03-01', specs: { ar: 'SVG أو PNG شفاف، دقة 300dpi، أبعاد لا تقل عن 2000x2000px', en: 'SVG or transparent PNG, 300dpi, min 2000x2000px' } },
  { id: 'BF-002', name: 'company_logo_white.png', type: 'image/png', size: '180 KB', category: { ar: 'الشعار الأبيض', en: 'White Logo' }, status: 'approved', uploadDate: '2026-02-15', deadline: '2026-03-01', specs: { ar: 'PNG شفاف، خلفية شفافة، أبيض فقط', en: 'Transparent PNG, transparent background, white only' } },
  { id: 'BF-003', name: 'brand_guidelines_v3.pdf', type: 'application/pdf', size: '12.5 MB', category: { ar: 'دليل العلامة التجارية', en: 'Brand Guidelines' }, status: 'approved', uploadDate: '2026-02-16', deadline: '2026-03-01', specs: { ar: 'PDF، يتضمن الألوان والخطوط وقواعد الاستخدام', en: 'PDF, including colors, fonts, and usage rules' } },
  { id: 'BF-004', name: 'stage_video_30s.mp4', type: 'video/mp4', size: '85 MB', category: { ar: 'فيديو المسرح (30 ثانية)', en: 'Stage Video (30 sec)' }, status: 'pending', uploadDate: '2026-02-20', deadline: '2026-03-10', specs: { ar: 'MP4، 1920x1080، 30 ثانية كحد أقصى، H.264', en: 'MP4, 1920x1080, max 30 sec, H.264' } },
  { id: 'BF-005', name: 'led_screen_creative.mp4', type: 'video/mp4', size: '120 MB', category: { ar: 'إعلان الشاشات LED', en: 'LED Screen Ad' }, status: 'pending', uploadDate: '2026-02-20', deadline: '2026-03-10', specs: { ar: 'MP4، 3840x2160 (4K)، 15 ثانية، H.265', en: 'MP4, 3840x2160 (4K), 15 sec, H.265' } },
  { id: 'BF-006', name: '', type: '', size: '', category: { ar: 'تصميم اللافتات المعلقة', en: 'Hanging Banner Design' }, status: 'required', deadline: '2026-03-15', specs: { ar: 'PDF أو AI، 3m x 6m، CMYK، 150dpi', en: 'PDF or AI, 3m x 6m, CMYK, 150dpi' } },
  { id: 'BF-007', name: '', type: '', size: '', category: { ar: 'تصميم الملصقات الأرضية', en: 'Floor Sticker Design' }, status: 'required', deadline: '2026-03-15', specs: { ar: 'PDF أو AI، 2m x 2m، CMYK، 300dpi', en: 'PDF or AI, 2m x 2m, CMYK, 300dpi' } },
  { id: 'BF-008', name: 'booth_branding_v1.ai', type: 'application/illustrator', size: '45 MB', category: { ar: 'تصميم الكشك', en: 'Booth Branding' }, status: 'rejected', uploadDate: '2026-02-18', deadline: '2026-03-10', feedback: { ar: 'الدقة غير كافية — يرجى رفع ملف بدقة 300dpi على الأقل', en: 'Resolution insufficient — please upload at least 300dpi' }, specs: { ar: 'AI أو PDF، حسب أبعاد الكشك، CMYK، 300dpi', en: 'AI or PDF, per booth dimensions, CMYK, 300dpi' } },
];

const statusConfig = {
  approved: { icon: CheckCircle, color: 'text-[#d4b85a]', bg: 'bg-[#fbf8f0]0/10', border: 'border-[#fbf8f0]0/20', label: { ar: 'معتمد', en: 'Approved' } },
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: { ar: 'قيد المراجعة', en: 'Under Review' } },
  rejected: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: { ar: 'مرفوض', en: 'Rejected' } },
  required: { icon: Upload, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: { ar: 'مطلوب رفعه', en: 'Upload Required' } },
};

const fileIcons: Record<string, any> = {
  'image': FileImage,
  'video': FileVideo,
  'application/pdf': FileText,
  'default': File,
};

export default function BrandAssets() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = filterStatus === 'all' ? brandFiles : brandFiles.filter(f => f.status === filterStatus);

  const stats = {
    total: brandFiles.length,
    approved: brandFiles.filter(f => f.status === 'approved').length,
    pending: brandFiles.filter(f => f.status === 'pending').length,
    rejected: brandFiles.filter(f => f.status === 'rejected').length,
    required: brandFiles.filter(f => f.status === 'required').length,
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image')) return FileImage;
    if (type.startsWith('video')) return FileVideo;
    if (type === 'application/pdf') return FileText;
    return File;
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title=""
        image={IMAGES.brandDisplay}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button onClick={() => toast.info(l({ ar: 'ميزة الرفع قادمة قريباً', en: 'Upload feature coming soon' }))} className="px-4 py-2 rounded-lg text-xs font-bold bg-[#fbf8f0]0 text-white hover:shadow-[0_0_15px_rgba(152,112,18,0.2)] transition-all flex items-center gap-1.5">
          <Plus size={14} />
          {l({ ar: 'رفع ملف جديد', en: 'Upload New File' })}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        {[
          { label: { ar: 'إجمالي الملفات', en: 'Total Files' }, value: stats.total, color: 'text-foreground' },
          { label: { ar: 'معتمد', en: 'Approved' }, value: stats.approved, color: 'text-[#d4b85a]' },
          { label: { ar: 'قيد المراجعة', en: 'Pending' }, value: stats.pending, color: 'text-yellow-400' },
          { label: { ar: 'مرفوض', en: 'Rejected' }, value: stats.rejected, color: 'text-red-400' },
          { label: { ar: 'مطلوب', en: 'Required' }, value: stats.required, color: 'text-blue-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card animate-border-glow rounded-xl p-3 text-center">
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[9px] text-muted-foreground/50 mt-0.5">{l(stat.label)}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'approved', 'pending', 'rejected', 'required'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-colors ${filterStatus === s ? 'bg-[#fbf8f0]0 text-white' : 'bg-muted/50 text-muted-foreground/70 hover:text-muted-foreground border border-border'}`}>
            {s === 'all' ? l({ ar: 'الكل', en: 'All' }) : l(statusConfig[s as keyof typeof statusConfig].label)}
          </button>
        ))}
      </div>

      {/* Files List */}
      <div className="space-y-2 sm:space-y-3">
        {filtered.map((file, i) => {
          const cfg = statusConfig[file.status];
          const Icon = file.status === 'required' ? Upload : getFileIcon(file.type);
          return (
            <div key={file.id} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-start gap-3">
                <div className={`p-2 sm:p-3 rounded-xl ${cfg.bg} border ${cfg.border} shrink-0`}>
                  <Icon size={18} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-foreground">{l(file.category)}</h3>
                      {file.name && <p className="text-[9px] text-muted-foreground/50 mt-0.5 truncate">{file.name} {file.size && `(${file.size})`}</p>}
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-medium ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                      <cfg.icon size={10} />
                      {l(cfg.label)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[9px] text-muted-foreground/50">
                    <span>{l({ ar: 'المواصفات:', en: 'Specs:' })} {l(file.specs)}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-[9px]">
                    <span className="text-muted-foreground/50">{l({ ar: 'الموعد النهائي:', en: 'Deadline:' })} <span className="text-[#987012]">{file.deadline}</span></span>
                    {file.uploadDate && <span className="text-muted-foreground/50">{l({ ar: 'تاريخ الرفع:', en: 'Uploaded:' })} {file.uploadDate}</span>}
                  </div>

                  {file.feedback && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                      <p className="text-[9px] text-red-400">{l({ ar: 'ملاحظة:', en: 'Feedback:' })} {l(file.feedback)}</p>
                    </div>
                  )}

                  {file.status === 'required' && (
                    <button onClick={() => toast.info(l({ ar: 'ميزة الرفع قادمة قريباً', en: 'Upload feature coming soon' }))} className="mt-2 px-3 py-1.5 rounded-lg text-[10px] font-medium border border-blue-500/20 text-blue-400 hover:bg-blue-500/5 transition-colors flex items-center gap-1.5">
                      <Upload size={11} />
                      {l({ ar: 'رفع الملف', en: 'Upload File' })}
                    </button>
                  )}

                  {file.status === 'rejected' && (
                    <button onClick={() => toast.info(l({ ar: 'ميزة إعادة الرفع قادمة قريباً', en: 'Re-upload feature coming soon' }))} className="mt-2 px-3 py-1.5 rounded-lg text-[10px] font-medium border border-red-500/20 text-red-400 hover:bg-red-500/5 transition-colors flex items-center gap-1.5">
                      <Upload size={11} />
                      {l({ ar: 'إعادة رفع', en: 'Re-upload' })}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Tip */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
        <div className="flex items-start gap-3">
          <Bot size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-400 mb-1">{l({ ar: 'نصيحة Maham AI', en: 'Maham AI Tip' })}</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: 'لتسريع عملية الاعتماد، تأكد من أن جميع الملفات تتوافق مع المواصفات المطلوبة. الملفات التي لا تتوافق مع المواصفات ستُرفض تلقائياً وستحتاج لإعادة رفعها.', en: 'To speed up approval, ensure all files meet required specifications. Non-compliant files will be automatically rejected and need re-uploading.' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
