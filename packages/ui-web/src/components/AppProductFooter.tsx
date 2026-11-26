'use client';

import { useTranslation } from '@17suit/i18n/react';
import type { CSSProperties, ReactNode } from 'react';

import { AppThemeToggle } from './AppThemeToggle';
import { ProductLanguageSelect } from './ProductLanguageSelect';

export interface AppProductFooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface AppProductFooterProps {
  productName: string;
  productSlug?: string;
  productTagline?: string;
  suiteName?: string;
  homeHref?: string;
  signInHref?: string;
  signUpHref?: string;
  isSignedIn?: boolean;
  signOutControl?: ReactNode;
  actionControls?: ReactNode;
  productLinks?: AppProductFooterLink[];
  productLinkControls?: ReactNode;
  legalLinks?: AppProductFooterLink[];
  legalLinkControls?: ReactNode;
  /** Theme control rendered in the footer; defaults to AppThemeToggle, `false` hides it. */
  themeControl?: ReactNode | false;
  /** Language control; defaults to ProductLanguageSelect, `false` hides it. */
  languageControl?: ReactNode | false;
}

const containerStyle: CSSProperties = {
  width: '100%',
  // Theme-reactive: follows the `dark` class on <html> via token vars.
  background: 'color-mix(in srgb, var(--suit-color-surface) 88%, transparent)',
  borderTop: '1px solid var(--color-border-default, rgba(0, 23, 31, 0.12))',
};

const contentStyle: CSSProperties = {
  maxWidth: 1080,
  margin: '0 auto',
  padding: '24px 16px',
  display: 'grid',
  gap: 16,
};

const brandRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
};

const actionRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
};

const baseButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  borderRadius: 'var(--radius-md, 8px)',
  border: '1px solid var(--color-border-default, rgba(0, 23, 31, 0.12))',
  minHeight: 44,
  padding: '10px 16px',
  fontFamily: '"Zilla Slab", serif',
  fontSize: 16,
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '0.0125em',
};

export const appProductFooterButtonStyle = baseButtonStyle;

const textLinkStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 44,
  color: 'var(--color-muted, #394448)',
  textDecoration: 'none',
  fontFamily: '"Zilla Slab", serif',
  fontSize: 16,
  lineHeight: 1.5,
};

export const appProductFooterTextLinkStyle = textLinkStyle;

function renderLink(link: AppProductFooterLink, index: number) {
  return (
    <a
      key={`${link.label}-${index}`}
      href={link.href}
      style={textLinkStyle}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noreferrer noopener' : undefined}
    >
      {link.label}
    </a>
  );
}

export function AppProductFooter({
  productName,
  productSlug,
  productTagline,
  suiteName = '17Suit',
  homeHref = '/',
  signInHref = '/sign-in',
  signUpHref = '/sign-up',
  isSignedIn = false,
  signOutControl,
  actionControls,
  productLinks = [],
  productLinkControls,
  legalLinks = [],
  legalLinkControls,
  themeControl,
  languageControl,
}: AppProductFooterProps) {
  const { t } = useTranslation('common');
  const year = new Date().getFullYear();

  return (
    <footer style={containerStyle}>
      <div style={contentStyle}>
        <div style={brandRowStyle}>
          <div style={{ display: 'grid', gap: 4 }}>
            <p
              style={{
                margin: 0,
                color: 'var(--color-text, #00151c)',
                fontFamily: '"Arvo", serif',
                fontSize: 24,
                lineHeight: 1.25,
                fontWeight: 700,
              }}
            >
              {productName}
            </p>
            <p
              style={{
                margin: 0,
                color: 'var(--color-muted, #394448)',
                fontFamily: '"Zilla Slab", serif',
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              {productTagline ??
                `${t('footer.tagline', { suite: suiteName })}${productSlug ? ` · ${productSlug}` : ''}`}
            </p>
          </div>

          <div style={actionRowStyle}>
            {actionControls ?? (
              <>
                <a
                  href={homeHref}
                  style={{ ...baseButtonStyle, color: 'var(--color-brand-dark, #00171f)' }}
                >
                  {t('footer.home')}
                </a>
                {isSignedIn ? (
                  signOutControl
                ) : (
                  <>
                    <a
                      href={signInHref}
                      style={{ ...baseButtonStyle, color: 'var(--color-brand-dark, #00171f)' }}
                    >
                      {t('footer.signIn')}
                    </a>
                    <a
                      href={signUpHref}
                      style={{
                        ...baseButtonStyle,
                        color: '#ffffff',
                        border: '1px solid #01695b',
                        background:
                          'linear-gradient(95deg, var(--color-action-primary, #007f60), var(--color-action-primary-hover, #007666))',
                        boxShadow: '0 10px 22px rgba(0, 145, 110, 0.24)',
                      }}
                    >
                      {t('footer.signUp')}
                    </a>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {productLinkControls ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>{productLinkControls}</div>
        ) : productLinks.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {productLinks.map((link, index) => renderLink(link, index))}
          </div>
        ) : null}

        {legalLinkControls ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>{legalLinkControls}</div>
        ) : legalLinks.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {legalLinks.map((link, index) => renderLink(link, index))}
          </div>
        ) : null}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <p
            style={{
              margin: 0,
              color: 'var(--color-muted, #394448)',
              fontFamily: '"Zilla Slab", serif',
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            © {year} {suiteName}. {t('footer.rights')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
            {languageControl === false ? null : (languageControl ?? <ProductLanguageSelect />)}
            {themeControl === false ? null : (themeControl ?? <AppThemeToggle />)}
          </div>
        </div>
      </div>
    </footer>
  );
}
