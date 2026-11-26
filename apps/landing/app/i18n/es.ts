import type { CatalogShape } from '@17suit/i18n';
import type { landing as en } from './en';

export const landing: CatalogShape<typeof en> = {
  meta: {
    siteName: '17Suit',
    homeTitle: '17Suit | Una cuenta para todas tus apps',
    homeDescription:
      'Revisa tus gastos, reserva cancha y, pronto, planea viajes, ordena tu clóset y agenda tu corte con una sola cuenta 17Suit.',
    notFoundTitle: 'Producto no encontrado | 17Suit',
    contactTitle: 'Contacto | 17Suit',
    contactDescription: 'Escríbenos si tienes dudas sobre tu cuenta 17Suit o alguna de sus apps.',
    privacyTitle: 'Política de privacidad | 17Suit',
    privacyDescription: 'Política de privacidad de 17Suit. Documento en revisión.',
    termsTitle: 'Términos y condiciones | 17Suit',
    termsDescription: 'Términos y condiciones de uso de 17Suit. Documento en revisión.',
    appsTitle: 'Elige tu app | 17Suit',
    appsDescription: 'Abre cualquier app de 17Suit con tu cuenta.',
  },
  nav: {
    logoAlt: '17Suit, inicio',
    logoAltFooter: '17Suit',
    account: 'Cuenta',
    signIn: 'Entrar',
    myApps: 'Mis apps',
    signOut: 'Cerrar sesión',
    home: 'Inicio',
    products: 'Productos',
    legal: 'Legal y contacto',
    privacy: 'Privacidad',
    terms: 'Términos',
    contact: 'Contacto',
  },
  footer: {
    tagline: 'Una cuenta para todas las apps de 17Suit.',
    rights: '© 2026 17Suit',
  },
  status: {
    live: 'Disponible',
    beta: 'Disponible · beta',
    soon: 'Próximamente',
  },
  home: {
    heroTitle: 'Una app para cada pendiente. Una sola cuenta para todas.',
    heroBody:
      'Revisa tus gastos con Fifteen y reserva cancha con Seven. Pronto también podrás planear viajes, ordenar tu clóset y agendar tu corte. Entras una vez y sigues en cualquier app de 17Suit.',
    createAccount: 'Crear cuenta',
    openMyApps: 'Abrir mis apps',
    seeProducts: 'Ver productos',
    productsTitle: 'Productos',
    productsIntro:
      'Cada número es una app, con un nombre en inglés que dice para qué sirve. {{available}} disponibles hoy y {{upcoming}} en camino.',
    tryInApp: 'Probar en la app',
    seeDetails: 'Ver detalles',
    benefitsTitle: 'Con una sola cuenta:',
    benefits: [
      'Entras una vez y abres cualquier app de 17Suit',
      'Vuelves a la app desde la que llegaste',
      'Recuperas tu contraseña con un código en tu correo',
    ],
    ctaTitle: 'Empieza con una cuenta',
    ctaBody: 'Es la misma para todas las apps de 17Suit.',
    haveAccount: 'Ya tengo cuenta',
  },
  mocks: {
    sample: 'Vista de ejemplo con datos ficticios.',
    heroFifteen: 'Fifteen: movimientos por revisar. Datos ficticios.',
    heroSeven: 'Seven: horarios libres de una cancha. Datos ficticios.',
    fifteen: {
      title: 'Por revisar',
      count: '{{count}} movimientos',
      confirm: 'Confirmar',
      movements: [
        {
          sender: 'Banco Andino',
          detail: 'Compra en Café Lumbre',
          amount: '−$245.00',
          category: 'Comida',
        },
        {
          sender: 'PagaFácil',
          detail: 'Suscripción Musicbox',
          amount: '−$129.00',
          category: 'Suscripciones',
        },
        {
          sender: 'Banco Andino',
          detail: 'Transferencia recibida',
          amount: '+$3,200.00',
          category: 'Ingresos',
        },
      ],
    },
    seven: {
      venue: 'Complejo Los Álamos',
      court: 'Cancha 2 · Fútbol 7',
      slotLength: 'Turnos de 1 h',
      days: ['Vie', 'Sáb', 'Dom'],
      selected: 'Sábado 14 · 10:00',
      book: 'Reservar',
    },
    concept: {
      badge: 'Idea en desarrollo',
      caption: 'Boceto de la idea en desarrollo. La app final puede verse distinta.',
      trip: {
        title: 'Itinerario',
        days: [
          { day: 'Día 1', items: ['Vuelo de ida', 'Hotel'] },
          { day: 'Día 2', items: ['Museo', 'Cena reservada'] },
          { day: 'Día 3', items: ['Playa', 'Vuelo de regreso'] },
        ],
        shared: 'Plan compartido',
      },
      closet: {
        title: 'Tu clóset',
        garments: ['Camisa', 'Pantalón', 'Chaqueta', 'Vestido', 'Zapatos', 'Bufanda'],
        look: 'Look para el trabajo',
        save: 'Guardar look',
      },
      barber: {
        title: 'Agenda del día',
        barbers: ['Barbero 1', 'Barbero 2'],
        cut: 'Corte',
        beard: 'Barba',
        free: 'Libre',
        regular: 'Cliente frecuente',
        reminder: 'Recordatorio',
      },
    },
  },
  product: {
    betaNote: 'Beta: ya puedes usarla; algunas pantallas todavía pueden cambiar.',
    tryProduct: 'Probar {{name}}',
    howItWorks: 'Cómo funciona',
    howItWillWork: 'Cómo funcionará',
    backHome: 'Volver al inicio',
    notOpen:
      '{{name}} todavía no abre. Crea tu cuenta 17Suit; cuando {{short}} abra, aparecerá en Mis apps y entrarás con la misma cuenta.',
    createSuitAccount: 'Crear cuenta 17Suit',
    step: 'Paso',
    whatYouCan: 'Lo que puedes hacer',
    whatYouWillBeAbleTo: 'Lo que podrás hacer',
    dataTitle: 'Tus datos',
    policyInReview: 'La política de privacidad está en revisión.',
    dataBody: 'Antes de conectar tu correo, revisa cómo tratamos tus datos.',
    readPolicy: 'Leer la política de privacidad',
  },
  products: {
    fifteen: {
      tagline: 'Tus gastos, tarjetas y pagos fijos, ordenados desde los correos de tu banco.',
      headline: 'Sabe en qué se fue tu dinero este mes sin pasar movimientos a mano.',
      summary:
        'Conecta tu Gmail y Fifteen lee las notificaciones de tus bancos y pasarelas de pago. Cada movimiento queda en revisión hasta que tú lo confirmas, así tus cuentas solo muestran lo que ya validaste.',
      highlights: [
        'Solo los remitentes que apruebas generan movimientos; los demás puedes bloquearlos',
        'Lo que Fifteen no reconoce con seguridad aparece aparte, marcado para corregir',
        'Lo que descartas o pospones sale de la cola sin contar en tu mes, y puedes restaurarlo',
        'Cada tarjeta guarda su día de corte y su día de pago',
      ],
      steps: [
        {
          title: 'Conecta tu correo',
          body: 'Vinculas tu Gmail y, entre los remitentes que encuentra, eliges los de tus bancos y pagos.',
        },
        {
          title: 'Revisa cada movimiento',
          body: 'Confirmas, descartas o pospones lo que Fifteen detectó en tus correos.',
        },
        {
          title: 'Mira tu mes completo',
          body: 'Ingresos, gastos, tarjetas y pagos fijos quedan en un panel mensual.',
        },
      ],
    },
    seven: {
      tagline: 'Reserva cancha en tu complejo deportivo o administra las de tu negocio.',
      headline: 'Reserva cancha sin llamadas, y llena tu agenda si administras el complejo.',
      summary:
        'Los complejos deportivos publican sus canchas y horarios; los jugadores eligen un horario libre y reservan. Si el complejo no pide anticipo, la reserva queda confirmada al instante; si lo pide, el complejo la confirma al recibirlo.',
      highlights: [
        'Canchas con horarios y duración de turno propios',
        'Una vista para quien administra y otra para quien juega',
        'Reservas pendientes, de hoy y próximas en un mismo lugar',
      ],
      steps: [
        {
          title: 'Elige cómo vas a usarlo',
          body: 'Al crear tu cuenta indicas si administras un complejo o vienes a jugar.',
        },
        {
          title: 'El complejo abre sus horarios',
          body: 'Quien administra registra sus canchas y los horarios de cada día.',
        },
        {
          title: 'Reservas tu cancha',
          body: 'Eliges cancha y hora. Sin anticipo, tu reserva queda confirmada al instante; con anticipo, el complejo la confirma al recibirlo.',
        },
      ],
    },
    one: {
      tagline: 'Pasa de la idea de viaje a un itinerario que todos pueden seguir.',
      headline: 'Un solo plan de viaje, claro para todos los que van.',
      summary:
        'One Plan Trip reunirá las ideas, reservas y notas del viaje en un itinerario compartido con quienes viajan contigo.',
      highlights: [
        'Itinerario día por día',
        'Reservas y notas clave en el mismo plan',
        'Plan compartido con tus compañeros de viaje',
      ],
      steps: [
        {
          title: 'Reúne las ideas',
          body: 'Guardas destinos, reservas y notas del viaje en un solo lugar.',
        },
        {
          title: 'Arma el itinerario',
          body: 'Ordenas todo en un plan día por día.',
        },
        {
          title: 'Compártelo',
          body: 'Quienes viajan contigo ven el mismo plan.',
        },
      ],
    },
    closet: {
      tagline: 'Tu ropa en un catálogo visual para armar looks por ocasión.',
      headline: 'Decide qué ponerte mirando tu clóset, no tu pila de ropa.',
      summary:
        'For Your Closet convertirá tu guardarropa en un catálogo visual para combinar prendas según la ocasión y ver qué usas de verdad.',
      highlights: [
        'Catálogo visual de tus prendas',
        'Combinaciones guardadas por ocasión',
        'Registro de qué prendas usas y cuáles no',
      ],
      steps: [
        {
          title: 'Sube tus prendas',
          body: 'Armas un catálogo visual con lo que hay en tu clóset.',
        },
        {
          title: 'Combina por ocasión',
          body: 'Creas y guardas looks para trabajo, salidas o viajes.',
        },
        {
          title: 'Mira qué usas',
          body: 'Ves qué prendas repites y cuáles llevan tiempo sin salir.',
        },
      ],
    },
    five: {
      tagline: 'Agenda de citas por barbero y clientes que vuelven.',
      headline: 'Una agenda por barbero y clientes que regresan a tiempo.',
      summary:
        'Five Barber Go ordenará las citas de cada profesional, el historial de tus clientes frecuentes y los recordatorios de asistencia.',
      highlights: [
        'Agenda de servicios por profesional',
        'Historial de clientes recurrentes',
        'Recordatorios de asistencia',
      ],
      steps: [
        {
          title: 'Publica tu agenda',
          body: 'La barbería registra sus servicios y los horarios de cada barbero.',
        },
        {
          title: 'El cliente aparta su cita',
          body: 'Elige servicio, barbero y hora disponible.',
        },
        {
          title: 'Recordatorio y regreso',
          body: 'El cliente recibe un recordatorio y su historial queda para la próxima visita.',
        },
      ],
    },
  },
  contact: {
    title: 'Contacto',
    intro: 'Escríbenos si tienes dudas sobre tu cuenta 17Suit, el acceso a alguna app o tus datos.',
    emailLabel: 'Correo de contacto',
    pending: 'Canal de contacto en configuración.',
    alsoReview: 'También puedes revisar la',
    privacyLink: 'Política de privacidad',
    and: 'y los',
    termsLink: 'Términos',
  },
  legal: {
    lastUpdated: 'Última actualización:',
    pending: 'Pendiente',
    inReview: 'Documento en revisión.',
    toc: 'Contenido',
    pendingText: 'Pendiente de redacción.',
    meanwhile: 'Mientras tanto, escríbenos desde la',
    contactPage: 'página de contacto',
    privacy: {
      title: 'Política de privacidad',
      description: 'Cómo trata 17Suit los datos de tu cuenta y de las apps que usas con ella.',
      sections: {
        'data-collected': 'Qué datos recopilamos',
        'data-use': 'Para qué los usamos',
        'gmail-access': 'Acceso a Gmail (Fifteen Account Check)',
        'data-sharing': 'Con quién los compartimos',
        'data-retention': 'Cuánto tiempo los guardamos',
        'your-rights': 'Tus derechos y cómo revocar el acceso',
        contact: 'Contacto',
      },
    },
    terms: {
      title: 'Términos y condiciones',
      description: 'Las reglas para usar tu cuenta 17Suit y las apps de la suite.',
      sections: {
        acceptance: 'Aceptación de los términos',
        service: 'Qué ofrece 17Suit',
        account: 'Tu cuenta 17Suit',
        'acceptable-use': 'Uso permitido',
        'third-party': 'Servicios de terceros',
        'intellectual-property': 'Propiedad intelectual',
        liability: 'Limitación de responsabilidad',
        suspension: 'Suspensión y cancelación de la cuenta',
        changes: 'Cambios a estos términos',
        contact: 'Contacto',
      },
    },
  },
  account: {
    shell: {
      reasons: [
        'Una cuenta para todas las apps de 17Suit.',
        'Después de entrar, vuelves a la app desde la que llegaste.',
        'Si olvidas tu contraseña, la recuperas con un código en tu correo.',
      ],
    },
    errors: {
      form_identifier_not_found:
        'No encontramos una cuenta con ese correo. Revísalo o crea una cuenta.',
      form_password_incorrect: 'La contraseña no es correcta. Inténtalo de nuevo o restablécela.',
      form_identifier_exists: 'Ya existe una cuenta con ese correo. Inicia sesión.',
      form_param_format_invalid: 'Revisa el formato del correo electrónico.',
      form_param_nil: 'Completa todos los campos.',
      form_password_length_too_short: 'La contraseña es muy corta. Elige una más larga.',
      form_password_pwned:
        'Esa contraseña apareció en una filtración de datos. Elige una distinta.',
      form_password_not_strong_enough: 'La contraseña es muy débil. Combina más caracteres.',
      form_password_validation_failed: 'La contraseña no cumple los requisitos. Elige otra.',
      form_code_incorrect: 'El código no es correcto. Revisa tu correo e inténtalo de nuevo.',
      verification_expired: 'El código venció. Solicita uno nuevo.',
      verification_failed: 'No pudimos verificar el código. Solicita uno nuevo.',
      strategy_for_user_invalid:
        'Esta cuenta no usa contraseña. Entra con Google o restablece tu contraseña.',
      user_locked:
        'Tu cuenta está bloqueada temporalmente por varios intentos fallidos. Espera unos minutos.',
      too_many_requests: 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.',
      rate_limit_exceeded: 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.',
      captcha_invalid:
        'No pudimos validar que eres una persona. Recarga la página e inténtalo de nuevo.',
      not_allowed_access:
        'Este correo no tiene acceso. Usa otro o escríbenos desde la página de contacto.',
      contactLink: 'Ir a la página de contacto',
      mismatch: 'Las contraseñas no coinciden.',
    },
    apps: {
      title: 'Elige tu app',
      introSignedIn: 'Tu cuenta 17Suit ya abre estas apps. Elige con cuál empezar.',
      introSignedOut: 'Inicia sesión con tu cuenta 17Suit para abrir estas apps.',
      open: 'Abrir {{name}}',
      upcomingTitle: 'Próximamente',
      upcomingBody: 'Cuando abran, aparecerán en esta lista y entrarás con la misma cuenta.',
      signIn: 'Iniciar sesión',
    },
    signIn: {
      title: 'Inicia sesión en 17Suit',
      description: 'Entra con Google o con tu correo y sigue en la app donde estabas.',
      google: 'Continuar con Google',
      googleOpening: 'Abriendo Google…',
      or: 'o con tu correo',
      email: 'Correo electrónico',
      emailPlaceholder: 'tu@correo.com',
      password: 'Contraseña',
      passwordPlaceholder: 'Tu contraseña',
      submit: 'Iniciar sesión',
      submitting: 'Iniciando sesión…',
      createAccount: 'Crear cuenta',
      forgot: 'Olvidé mi contraseña',
      incomplete:
        'No pudimos completar el inicio de sesión. Inténtalo de nuevo o restablece tu contraseña.',
      generic: 'No pudimos iniciar sesión. Inténtalo de nuevo en unos minutos.',
    },
    signUp: {
      title: 'Crea tu cuenta 17Suit',
      description:
        'Regístrate una vez con Google o con tu correo y usa la misma cuenta en todas las apps de 17Suit.',
      forProduct: 'Crearás tu cuenta para entrar a {{name}}.',
      passwordPlaceholder: 'Crea una contraseña',
      passwordHint: 'Usa al menos 8 caracteres. Evita contraseñas que ya usas en otros sitios.',
      confirm: 'Confirmar contraseña',
      confirmPlaceholder: 'Repite tu contraseña',
      submit: 'Crear cuenta',
      submitting: 'Creando cuenta…',
      review: 'Consulta los',
      terms: 'Términos',
      and: 'y la',
      privacy: 'Política de privacidad',
      haveAccount: 'Ya tengo cuenta',
      checkEmail: 'Revisa tu correo',
      codeSent: 'Te enviamos un código a {{email}}. Escríbelo aquí para activar tu cuenta.',
      code: 'Código de verificación',
      verify: 'Verificar correo',
      verifying: 'Verificando…',
      resend: 'Reenviar código',
      resending: 'Enviando código…',
      changeEmail: 'Cambiar correo',
      resent: 'Te enviamos un código nuevo a {{email}}.',
      resendFailed: 'No pudimos reenviar el código. Espera unos minutos e inténtalo de nuevo.',
      verifyFailed: 'No pudimos verificar el código. Revisa tu correo e inténtalo de nuevo.',
      createFailed: 'No pudimos crear tu cuenta. Inténtalo de nuevo.',
      generic: 'No pudimos crear tu cuenta. Inténtalo de nuevo en unos minutos.',
    },
    forgot: {
      title: 'Recupera el acceso',
      description: 'Te enviamos un código a tu correo para que elijas una contraseña nueva.',
      sendCode: 'Enviar código',
      sending: 'Enviando…',
      newPassword: 'Nueva contraseña',
      repeatPassword: 'Repite la contraseña',
      confirmNewPassword: 'Confirmar nueva contraseña',
      update: 'Actualizar contraseña',
      updating: 'Actualizando…',
      backToSignIn: 'Volver a iniciar sesión',
      resetFailed: 'No pudimos restablecer tu contraseña. Solicita un código nuevo.',
      generic: 'No pudimos restablecer tu contraseña. Inténtalo de nuevo en unos minutos.',
    },
  },
};
