import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '../components/legal-page';

export const metadata: Metadata = {
  title: 'Política de privacidad | 17Suit',
  description: 'Política de privacidad de 17Suit. Documento en revisión.',
  // Placeholder outline: keep out of search results until the final text is published.
  robots: { index: false, follow: true },
};

// TODO(legal): every section below is a placeholder; the owner writes the text.
// `acceso-a-gmail` is linked from the Fifteen Account Check product page; keep the id.
const sections: readonly LegalSection[] = [
  { id: 'datos-que-recopilamos', title: 'Qué datos recopilamos' },
  { id: 'para-que-los-usamos', title: 'Para qué los usamos' },
  { id: 'acceso-a-gmail', title: 'Acceso a Gmail (Fifteen Account Check)' },
  { id: 'con-quien-los-compartimos', title: 'Con quién los compartimos' },
  { id: 'cuanto-tiempo-los-guardamos', title: 'Cuánto tiempo los guardamos' },
  { id: 'tus-derechos', title: 'Tus derechos y cómo revocar el acceso' },
  { id: 'contacto', title: 'Contacto', linksToContact: true },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      description="Cómo trata 17Suit los datos de tu cuenta y de las apps que usas con ella."
      sections={sections}
    />
  );
}
