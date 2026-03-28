import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import arSA from '../locales/ar-SA.json';
import enUS from '../locales/en-US.json';

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  isArabic: boolean;
  isEnglish: boolean;
  languageName: string;
  languageFlag: string;
}

const rtlLanguages: Language[] = ['ar'];

const languageNames: Record<Language, string> = {
  ar: 'العربية',
  en: 'English',
};

const languageFlags: Record<Language, string> = {
  ar: '🇸🇦',
  en: '🇬🇧',
};

// Flatten nested JSON to dot-notation keys for backward compatibility
function flattenObject(obj: any, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObject(obj[key], fullKey));
    } else {
      result[fullKey] = String(obj[key]);
    }
  }
  return result;
}

// Pre-flatten translations for fast lookup
const flatAr = flattenObject(arSA);
const flatEn = flattenObject(enUS);

const flatTranslations: Record<Language, Record<string, string>> = {
  ar: flatAr,
  en: flatEn,
};

// Also support nested access
function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  if (typeof current === 'string') return current;
  return undefined;
}

const nestedTranslations: Record<Language, any> = {
  ar: arSA,
  en: enUS,
};

export const allLanguages: { code: Language; name: string; flag: string }[] = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('maham-language');
    if (saved === 'ar' || saved === 'en') return saved;
    return 'ar';
  });

  const direction: Direction = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
  const isRTL = direction === 'rtl';
  const isArabic = language === 'ar';
  const isEnglish = language === 'en';

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('dir', direction);
    root.setAttribute('lang', language === 'ar' ? 'ar-SA' : 'en-US');
    
    // Update font family based on language
    if (language === 'ar') {
      root.style.setProperty('--font-heading', "'Cairo', sans-serif");
      root.style.setProperty('--font-body', "'Tajawal', sans-serif");
    } else {
      root.style.setProperty('--font-heading', "'Inter', 'Cairo', sans-serif");
      root.style.setProperty('--font-body', "'Inter', 'Tajawal', sans-serif");
    }
    
    localStorage.setItem('maham-language', language);
  }, [language, direction]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'ar' ? 'en' : 'ar');
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    // Try flat lookup first (for backward compatibility with old 'nav.dashboard' style keys)
    let value: string | undefined = flatTranslations[language]?.[key];
    
    // If not found in flat, try nested lookup
    if (!value) {
      value = getNestedValue(nestedTranslations[language], key) ?? undefined;
    }
    
    // Fallback to Arabic
    if (!value && language !== 'ar') {
      const arFlat = flatTranslations['ar']?.[key];
      const arNested = getNestedValue(nestedTranslations['ar'], key);
      value = arFlat ?? arNested ?? undefined;
    }
    
    // Final fallback: return the key itself
    const resolved: string = value ?? key;
    
    // Replace params
    if (params) {
      let result = resolved;
      Object.entries(params).forEach(([k, v]) => {
        result = result.replace(`{${k}}`, String(v));
      });
      return result;
    }
    
    return resolved;
  }, [language]);

  const languageName = languageNames[language];
  const languageFlag = languageFlags[language];

  return (
    <LanguageContext.Provider value={{ 
      language, direction, setLanguage, toggleLanguage, t, 
      isRTL, isArabic, isEnglish, languageName, languageFlag 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Shortcut hook for translation function only
export function useTranslation() {
  const { t, language, direction, isArabic, isEnglish, isRTL, toggleLanguage } = useLanguage();
  return { t, language, direction, isArabic, isEnglish, isRTL, toggleLanguage };
}
