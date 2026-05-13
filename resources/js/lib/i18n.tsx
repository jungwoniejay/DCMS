import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en, { TranslationKey } from './translations/en';
import fil from './translations/fil';
import ceb from './translations/ceb';

export type Language = 'en' | 'fil' | 'ceb';

const translations: Record<Language, Record<TranslationKey, string>> = { en, fil, ceb };

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: 'en',  label: 'English',  flag: '🇺🇸' },
    { code: 'fil', label: 'Filipino', flag: '🇵🇭' },
    { code: 'ceb', label: 'Bisaya',   flag: '🇵🇭' },
];

interface LanguageContextType {
    lang: Language;
    setLang: (l: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: 'en',
    setLang: () => {},
    t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Language>(() => {
        const saved = localStorage.getItem('kidcare_lang');
        return (saved as Language) || 'en';
    });

    const setLang = (l: Language) => {
        setLangState(l);
        localStorage.setItem('kidcare_lang', l);
    };

    const t = (key: TranslationKey): string => {
        return translations[lang][key] ?? translations['en'][key] ?? key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    return useContext(LanguageContext);
}
