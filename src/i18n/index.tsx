import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { pt, Translations } from './locales/pt';
import { en } from './locales/en';

export type Language = 'pt' | 'en';

interface I18nContextType {
    lang: Language;
    t: Translations;
    setLang: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Language, Translations> = { pt, en };

export function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Language>(() => {
        try {
            const saved = localStorage.getItem('shiftsim_lang');
            return (saved as Language) || 'pt';
        } catch {
            return 'pt';
        }
    });

    const setLang = useCallback((newLang: Language) => {
        setLangState(newLang);
        try {
            localStorage.setItem('shiftsim_lang', newLang);
        } catch {
            // ignore
        }
    }, []);

    return (
        <I18nContext.Provider value={{ lang, t: translations[lang], setLang }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n(): I18nContextType {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
}