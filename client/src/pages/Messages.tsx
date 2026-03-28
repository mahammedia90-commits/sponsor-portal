/**
 * Messages — Communication center
 * Glassmorphism design
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageSquare, Send, User, Building2, Shield } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

const conversations = [
  { id: '1', name: 'فريق مهام إكسبو', nameEn: 'Maham Expo Team', role: 'مشرف', avatar: 'M', lastMsg: 'تم اعتماد رعايتك لمؤتمر ديب فيست 2026', lastMsgEn: 'Your DeepFest 2026 sponsorship has been approved', time: '10:30', unread: 2, online: true },
  { id: '2', name: 'إدارة العقود', nameEn: 'Contracts Dept.', role: 'عقود', avatar: 'ع', lastMsg: 'يرجى مراجعة وتوقيع العقد المرفق', lastMsgEn: 'Please review and sign the attached contract', time: 'أمس', unread: 1, online: false },
  { id: '3', name: 'فريق التسويق', nameEn: 'Marketing Team', role: 'تسويق', avatar: 'ت', lastMsg: 'تقرير أداء الحملة جاهز للمراجعة', lastMsgEn: 'Campaign performance report ready for review', time: 'أمس', unread: 0, online: true },
  { id: '4', name: 'الدعم الفني', nameEn: 'Technical Support', role: 'دعم', avatar: 'د', lastMsg: 'تم حل المشكلة المبلغ عنها', lastMsgEn: 'The reported issue has been resolved', time: '2 مارس', unread: 0, online: false },
];

export default function Messages() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const [selected, setSelected] = useState(conversations[0]);
  const [input, setInput] = useState('');

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-fade-in" style={{ height: 'calc(100vh - 140px)' }}>
      <PageHeader
        title={l({ ar: 'الرسائل', en: 'Messages' })}
        subtitle={l({ ar: 'تواصل مع فريق مهام إكسبو والرعاة', en: 'Communicate with Maham Expo team and sponsors' })}
        image={IMAGES.networking}
      />

      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-56 sm:w-72 border-l border-border overflow-y-auto">
          <div className="p-3 border-b border-border">
            <h3 className="text-[10px] font-bold text-foreground">{l({ ar: 'المحادثات', en: 'Conversations' })}</h3>
          </div>
          {conversations.map(conv => (
            <button key={conv.id} onClick={() => setSelected(conv)}
              className={`w-full p-2.5 flex items-center gap-2 border-b border-border transition-colors ${selected.id === conv.id ? 'bg-[#987012]/5' : 'hover:bg-muted/30'}`}>
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#987012]/10 flex items-center justify-center text-[10px] font-bold text-[#987012]">{conv.avatar}</div>
                {conv.online && <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#d4b85a] rounded-full border border-background" />}
              </div>
              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-foreground truncate">{language === 'ar' ? conv.name : conv.nameEn}</span>
                  <span className="text-[8px] text-foreground/20">{conv.time}</span>
                </div>
                <p className="text-[9px] text-muted-foreground/50 truncate">{language === 'ar' ? conv.lastMsg : conv.lastMsgEn}</p>
              </div>
              {conv.unread > 0 && (
                <span className="bg-[#987012] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold shrink-0">{conv.unread}</span>
              )}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-border flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#987012]/10 flex items-center justify-center text-[10px] font-bold text-[#987012]">{selected.avatar}</div>
            <div>
              <p className="text-[10px] font-bold text-foreground">{language === 'ar' ? selected.name : selected.nameEn}</p>
              <p className="text-[8px] text-foreground/20">{selected.role}</p>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex justify-end mb-3">
              <div className="bg-muted/30 border border-border rounded-xl p-3 max-w-[70%]">
                <p className="text-[10px] text-foreground">{language === 'ar' ? selected.lastMsg : selected.lastMsgEn}</p>
                <p className="text-[8px] text-foreground/20 mt-1">{selected.time}</p>
              </div>
            </div>
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder={l({ ar: 'اكتب رسالتك...', en: 'Type a message...' })}
              className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-2 text-[10px] outline-none text-foreground placeholder:text-foreground/20 focus:border-[#987012]/30 transition-colors" />
            <button className="btn-cta-glass p-2 rounded-lg"><Send size={14} className="text-white" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
