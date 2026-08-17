import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { detectBrowserLanguage, I18nProvider, useI18n } from '../index';

describe('detectBrowserLanguage', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(window.navigator, 'language');

    afterEach(() => {
        if (originalDescriptor) {
            Object.defineProperty(window.navigator, 'language', originalDescriptor);
        }
    });

    const setBrowserLanguage = (lang: string) => {
        Object.defineProperty(window.navigator, 'language', {
            value: lang,
            configurable: true,
            writable: true,
        });
    };

    it('returns "en" for en-US', () => {
        setBrowserLanguage('en-US');
        expect(detectBrowserLanguage()).toBe('en');
    });

    it('returns "pt" for pt-BR', () => {
        setBrowserLanguage('pt-BR');
        expect(detectBrowserLanguage()).toBe('pt');
    });

    it('returns "es" for es-ES', () => {
        setBrowserLanguage('es-ES');
        expect(detectBrowserLanguage()).toBe('es');
    });

    it('returns "fr" for fr-FR', () => {
        setBrowserLanguage('fr-FR');
        expect(detectBrowserLanguage()).toBe('fr');
    });

    it('returns "pt" as fallback for unsupported languages', () => {
        setBrowserLanguage('de-DE');
        expect(detectBrowserLanguage()).toBe('pt');
    });

    it('returns "pt" when navigator.language is empty', () => {
        setBrowserLanguage('');
        expect(detectBrowserLanguage()).toBe('pt');
    });
});

describe('I18nProvider', () => {
    const TestConsumer = () => {
        const { lang } = useI18n();
        return <div data-testid="lang">{lang}</div>;
    };

    beforeEach(() => {
        localStorage.clear();
    });

    it('uses saved language from localStorage when valid', () => {
        localStorage.setItem('shiftsim_lang', 'es');
        const { getByTestId } = render(
            <I18nProvider>
                <TestConsumer />
            </I18nProvider>
        );
        expect(getByTestId('lang').textContent).toBe('es');
    });

    it('falls back to browser language when localStorage is empty', () => {
        Object.defineProperty(window.navigator, 'language', {
            value: 'en-US',
            configurable: true,
            writable: true,
        });
        const { getByTestId } = render(
            <I18nProvider>
                <TestConsumer />
            </I18nProvider>
        );
        expect(getByTestId('lang').textContent).toBe('en');
    });

    it('falls back to pt when localStorage has an unsupported language', () => {
        localStorage.setItem('shiftsim_lang', 'de');
        Object.defineProperty(window.navigator, 'language', {
            value: 'en-US',
            configurable: true,
            writable: true,
        });
        const { getByTestId } = render(
            <I18nProvider>
                <TestConsumer />
            </I18nProvider>
        );
        expect(getByTestId('lang').textContent).toBe('en');
    });

    it('defaults to pt when no localStorage and unsupported browser language', () => {
        Object.defineProperty(window.navigator, 'language', {
            value: 'de-DE',
            configurable: true,
            writable: true,
        });
        const { getByTestId } = render(
            <I18nProvider>
                <TestConsumer />
            </I18nProvider>
        );
        expect(getByTestId('lang').textContent).toBe('pt');
    });

    it('throws when useI18n is used outside I18nProvider', () => {
        const BadConsumer = () => {
            useI18n();
            return null;
        };
        expect(() => render(<BadConsumer />)).toThrow(
            'useI18n must be used within I18nProvider'
        );
    });
});
