import type { CatalogShape } from '@17suit/i18n';
import type { shell as en } from '../en/shell';

export const shell: CatalogShape<typeof en> = {
  meta: {
    description:
      'Reserva canchas eligiendo un horario libre y recibe la confirmación del complejo, sin cadenas de WhatsApp.',
  },
  brand: {
    suite: '17Suit',
    product: 'Seven Reservations Club',
  },
  footer: {
    productTagline: 'Reservas de canchas y agenda para complejos deportivos.',
    goToDashboard: 'Ir a mi panel',
    signIn: 'Iniciar sesión',
    signUp: 'Crear cuenta',
    signOut: 'Cerrar sesión',
  },
  home: {
    audiencePlayerTitle: 'Si juegas',
    audiencePlayerSteps: {
      step1: 'Busca el complejo por nombre o dirección.',
      step2: 'Elige cancha, día y uno de los horarios libres.',
      step3: 'Sigue tu reserva hasta que el complejo la confirme.',
    },
    audienceOwnerTitle: 'Si administras un complejo',
    audienceOwnerSteps: {
      step1: 'Publica tus canchas con sus horarios de apertura.',
      step2: 'Confirma o rechaza cada solicitud desde una sola lista.',
      step3: 'Revisa la agenda del día en la hora de tu complejo.',
    },
    previewTimeFormat: '{{hour}}:00 p. m.',
    previewCourt: 'Cancha 2 · Fútbol 5',
    previewDay: 'Sábado · hora del complejo',
    previewPending: 'pendiente de confirmación',
    previewCaption:
      'Ilustración: así eliges turno. Los ocupados aparecen tachados y solo puedes elegir entre los libres.',
    accountNav: 'Cuenta',
    heroTitle: 'Elige el horario libre y reserva tu cancha.',
    heroBody:
      'Seven Reservations Club muestra los turnos disponibles de cada cancha. Eliges día y hora, el complejo confirma tu reserva y ves el estado en un solo lugar, sin cadenas de mensajes por WhatsApp.',
    bookCourt: 'Reservar una cancha',
    publishVenue: 'Publicar mi complejo',
    haveAccount: '¿Ya tienes cuenta?',
    signInLink: 'Inicia sesión',
    howItWorks: 'Cómo funciona',
  },
  roleSwitch: {
    ownerToPlayer: {
      label: 'Cambiar a modo jugador',
      title: '¿Cambiar a modo jugador?',
      body: 'Verás la búsqueda de canchas y tus reservas como jugador. Tu complejo, canchas y solicitudes siguen guardados; vuelves a ellos cambiando a modo dueño.',
      confirm: 'Cambiar a jugador',
    },
    playerToOwner: {
      label: 'Cambiar a modo dueño',
      title: '¿Cambiar a modo dueño?',
      body: 'Verás el panel para administrar un complejo. Tus reservas como jugador siguen guardadas; vuelves a ellas cambiando a modo jugador.',
      confirm: 'Cambiar a dueño',
    },
    pending: 'Cambiando…',
    dismiss: 'Seguir aquí',
    error: 'No se pudo cambiar de modo. Intenta de nuevo.',
  },
  onboarding: {
    title: '¿Cómo vas a usar Seven Reservations Club?',
    subtitle:
      'Elige una opción. Define qué ves al entrar, y puedes cambiarla cuando quieras arriba, junto a “Cerrar sesión”.',
    player: {
      title: 'Quiero reservar canchas',
      description: 'Busca complejos, elige un horario libre y sigue el estado de tus reservas.',
      cta: 'Continuar como jugador',
    },
    owner: {
      title: 'Administro un complejo',
      description: 'Publica tus canchas y horarios, y confirma o rechaza las solicitudes.',
      cta: 'Continuar como dueño de complejo',
    },
    done: 'Listo. Te llevamos a tu panel…',
    saveError: 'No se pudo guardar tu elección. Intenta de nuevo.',
    roleCheckError: 'No pudimos revisar tu cuenta. Puedes elegir igual o reintentar.',
    retry: 'Reintentar',
    saving: 'Guardando…',
  },
  roleSelector: {
    pickRole: 'Selecciona tu rol para continuar.',
    currentRole: 'Rol actual detectado por {{source}}: {{role}}',
    retryLoad: 'Reintentar carga de rol',
    saving: 'Guardando...',
    clearError: 'Cerrar error y reintentar',
    ownerTitle: 'Soy dueno de un complejo',
    ownerSubtitle: 'Administra complejos, canchas y reservas de tus clientes.',
    ownerCta: 'Continuar como OWNER',
    playerTitle: 'Soy jugador',
    playerSubtitle: 'Busca complejos, reserva canchas y gestiona tus partidos.',
    playerCta: 'Continuar como PLAYER',
  },
};
