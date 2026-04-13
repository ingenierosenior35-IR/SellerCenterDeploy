import React from 'react';
import { act, render, screen, waitFor, fireEvent } from '@testing-library/react';

import enTranslation from './en/translation.json';
import esTranslation from './es/translation.json';
import { useTranslate, TranslateProvider, LANGUAGE_RESOURCE } from './i18n';

const Consumer = () => {
  const {
    mounted,
    translate,
    currentLang,
    allLanguages,
    currentLangOption,
    onChangeLang,
  } = useTranslate();

  return (
    <div>
      <div data-testid="mounted">{String(mounted)}</div>
      <div data-testid="lang">{currentLang}</div>
      <div data-testid="lang-option">{currentLangOption?.value ?? 'none'}</div>
      <div data-testid="t1">{translate('loginPage.title')}</div>
      <div data-testid="t2">{translate('sidebarMenu', 'home.title')}</div>
      <div data-testid="t3">{translate('missing.path', undefined, 'fallback')}</div>
      <div data-testid="all">{allLanguages.map((lang) => `${lang.value}:${lang.label}`).join('|')}</div>
      <button type="button" onClick={() => onChangeLang('en')}>
        to-en
      </button>
      <button type="button" onClick={() => onChangeLang('es')}>
        to-es
      </button>
      <button type="button" onClick={() => onChangeLang('xx' as any)}>
        invalid
      </button>
    </div>
  );
};

describe('i18n coverage harness', () => {
  beforeEach(() => {
    Object.keys(LANGUAGE_RESOURCE).forEach((key) => delete (LANGUAGE_RESOURCE as any)[key]);
    window.localStorage.clear();
  });

  it('covers detectLang, translation loading, fallbacks and language switching', async () => {
    Object.defineProperty(window.navigator, 'language', {
      configurable: true,
      value: 'en-US',
    });

    render(
      <TranslateProvider>
        <Consumer />
      </TranslateProvider>
    );

    await waitFor(() => expect(screen.getByTestId('mounted')).toHaveTextContent('true'));
    await waitFor(() => expect(screen.getByTestId('lang')).toHaveTextContent('en'));
    await waitFor(() => expect(screen.getByTestId('t1')).toHaveTextContent(enTranslation.loginPage.title));
    expect(screen.getByTestId('t2')).toHaveTextContent(enTranslation.sidebarMenu.home.title);
    expect(screen.getByTestId('t3')).toHaveTextContent('fallback');
    expect(screen.getByTestId('lang-option')).toHaveTextContent('en');
    expect(screen.getByTestId('all').textContent).toContain(`en:${enTranslation.languages.en}`);

    fireEvent.click(screen.getByRole('button', { name: 'to-es' }));
    await waitFor(() => expect(screen.getByTestId('lang')).toHaveTextContent('es'));
    await waitFor(() => expect(screen.getByTestId('t1')).toHaveTextContent(esTranslation.loginPage.title));
    expect(window.localStorage.getItem('i18n_lang')).toBe('es');

    fireEvent.click(screen.getByRole('button', { name: 'invalid' }));
    await waitFor(() => expect(screen.getByTestId('lang')).toHaveTextContent('es'));

    fireEvent.click(screen.getByRole('button', { name: 'to-en' }));
    await waitFor(() => expect(screen.getByTestId('lang')).toHaveTextContent('en'));
  });

  it('uses fallback es when no valid browser or stored lang and throws outside provider', () => {
    Object.defineProperty(window.navigator, 'language', {
      configurable: true,
      value: 'fr-FR',
    });

    const Orphan = () => {
      useTranslate();
      return null;
    };

    expect(() =>
      render(
        <TranslateProvider>
          <Consumer />
        </TranslateProvider>
      )
    ).not.toThrow();

    expect(() => render(<Orphan />)).toThrow('useTranslate must be inside <TranslateProvider>');

    act(() => {
      window.localStorage.setItem('i18n_lang', 'invalid');
    });
  });

  it('covers fallback resolution when namespace is missing in overloaded translate API', async () => {
    Object.defineProperty(window.navigator, 'language', {
      configurable: true,
      value: 'en-US',
    });

    const FallbackConsumer = () => {
      const { translate } = useTranslate();
      return <div data-testid="fallback-ns">{translate('missing.namespace', 'fallback-key')}</div>;
    };

    render(
      <TranslateProvider>
        <FallbackConsumer />
      </TranslateProvider>
    );

    await waitFor(() => expect(screen.getByTestId('fallback-ns')).toHaveTextContent('fallback-key'));
  });
});
