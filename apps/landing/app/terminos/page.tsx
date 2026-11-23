import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '../components/legal-page';

export const metadata: Metadata = {
  title: 'Términos y condiciones | 17Suit',
  description: 'Términos y condiciones de uso de 17Suit. Documento en revisión.',
  // Placeholder outline: keep out of search results until the final text is published.
  robots: { index: false, follow: true },
};

// TODO(legal): every section below is a placeholder; the owner writes the text.
const sections: readonly LegalSection[] = [
  { id: 'aceptacion', title: 'Aceptación de los términos' },
  { id: 'el-servicio', title: 'Qué ofrece 17Suit' },
  { id: 'tu-cuenta', title: 'Tu cuenta 17Suit' },
  { id: 'uso-permitido', title: 'Uso permitido' },
  { id: 'servicios-de-terceros', title: 'Servicios de terceros' },
  { id: 'propiedad-intelectual', title: 'Propiedad intelectual' },
  { id: 'responsabilidad', title: 'Limitación de responsabilidad' },
  { id: 'suspension-y-cancelacion', title: 'Suspensión y cancelación de la cuenta' },
  { id: 'cambios', title: 'Cambios a estos términos' },
  { id: 'contacto', title: 'Contacto', linksToContact: true },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Términos y condiciones"
      description="Las reglas para usar tu cuenta 17Suit y las apps de la suite."
      sections={sections}
    />
  );
}
