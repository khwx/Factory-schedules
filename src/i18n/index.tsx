import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { pt, Translations } from './locales/pt';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';

export type Language = 'pt' | 'en' | 'es' | 'fr' | 'de';

const SUPPORTED_LANGUAGES: Language[] = ['pt', 'en', 'es', 'fr', 'de'];

export function detectBrowserLanguage(): Language {
    try {
        const browserLang = navigator.language?.substring(0, 2).toLowerCase();
        if (browserLang && SUPPORTED_LANGUAGES.includes(browserLang as Language)) {
            return browserLang as Language;
        }
    } catch {
        // ignore
    }
    return 'pt';
}

interface I18nContextType {
    lang: Language;
    t: Translations;
    setLang: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Language, Translations> = { pt, en, es, fr, de };

export function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Language>(() => {
        try {
            const saved = localStorage.getItem('shiftsim_lang');
            if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) {
                return saved as Language;
            }
        } catch {
            // ignore
        }
        return detectBrowserLanguage();
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