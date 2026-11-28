import type { CatalogShape } from '@17suit/i18n';
import type { venue as en } from '../en/venue';

export const venue: CatalogShape<typeof en> = {
  common: {
    saving: 'Guardando…',
    checkFields: 'Revisa los campos marcados.',
    venueName: 'Nombre del complejo',
    venueNameMin: 'El nombre del complejo necesita al menos 3 caracteres.',
    durationRange: 'La duración del turno debe estar entre 30 y 240 minutos.',
    noPriceConfirm: 'Precio a confirmar con el complejo',
  },
  weekdays: {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
  },
  depositPolicy: {
    refund: 'Se devuelve el anticipo',
    retain: 'El complejo conserva el anticipo',
    ownerDecides: 'El complejo decide qué pasa con el anticipo',
  },
  policyFields: {
    paymentInstructions: 'Instrucciones de pago',
    depositPercent: 'Anticipo (% del precio)',
    depositFromMinutes: 'Depósito desde (minutos reservados)',
    holdMinutes: 'Minutos para pagar el anticipo',
    cancellationWindowHours: 'Cancelación en línea (horas antes)',
    lateCancelDeposit: 'Cancelación tardía: anticipo',
    noShowDeposit: 'No asistencia: anticipo',
    conditionsText: 'Condiciones adicionales',
  },
  policyErrors: {
    depositPercent: 'Usa un número entero entre 0 y 100.',
    depositFromMinutes: 'Usa entre 0 y 1440 minutos. 0 = siempre.',
    holdMinutes: 'Usa entre 5 y 1440 minutos (24 h).',
    cancellationWindowHours: 'Usa entre 0 y 168 horas (7 días).',
  },
  settings: {
    title: 'Ajustes del complejo',
    subtitle: 'Reglas que ven los jugadores al reservar en {{name}}.',
    contactPhone: {
      label: 'Teléfono o WhatsApp de contacto',
      placeholder: '+57 300 123 4567',
      hint: 'Aparece en las reservas pendientes para que el jugador pague o avise.',
    },
    paymentInstructions: {
      placeholder: 'Ej.: Llave Bre-B @micancha · Nequi 300 123 4567',
      hint: 'El jugador las ve mientras su reserva espera el anticipo.',
    },
    depositPercent: {
      hintZero: 'Con 0 %, cada reserva se confirma al instante, sin pasar por ti.',
      hintPending: 'La reserva queda pendiente hasta que registres el anticipo o la confirmes.',
    },
    depositFromMinutes: {
      hint: 'El anticipo solo se exige en reservas de al menos esta duración. 0 significa que toda reserva en línea lo requiere.',
    },
    holdMinutes: {
      hint: 'El turno queda apartado este tiempo. Si vence sin anticipo, el horario se libera.',
    },
    cancellationWindowHours: {
      hint: 'Hasta cuántas horas antes del turno el jugador puede cancelar sin escribirte.',
    },
    lateCancelDeposit: {
      hint: 'Lo que el jugador lee antes de reservar. La plataforma no mueve dinero: tú lo resuelves.',
    },
    noShowDeposit: {
      hint: 'Aplica cuando el jugador no llega y no cancela.',
    },
    conditionsText: {
      placeholder: 'Ej.: Llegar 10 min antes. Si llueve, se reprograma sin costo.',
      hint: 'Texto libre que el jugador ve antes de confirmar.',
    },
    bookingHorizonDays: {
      label: 'Reservas con anticipación (días)',
      hint: 'Hasta cuántos días adelante pueden reservar los jugadores.',
    },
    save: 'Guardar ajustes',
    saved: 'Guardaste los ajustes. Las próximas reservas ya usan estas reglas.',
    savedKeeping_one:
      'Guardaste los ajustes. Las próximas reservas usan las reglas nuevas; {{count}} reserva activa conserva las condiciones con que se hicieron.',
    savedKeeping_other:
      'Guardaste los ajustes. Las próximas reservas usan las reglas nuevas; {{count}} reservas activas conservan las condiciones con que se hicieron.',
    saveFailed: 'No se pudieron guardar los ajustes.',
    errors: {
      bookingHorizonDays: 'Usa entre 1 y 180 días.',
      phoneFormat: 'Escribe el número con indicativo, p. ej. +57 300 123 4567.',
      phoneRequired: 'Deja un teléfono: los jugadores lo usan para pagar o avisar.',
    },
  },
  publish: {
    title: 'Página pública',
    published: 'Publicada',
    unpublished: 'Sin publicar',
    intro:
      'Los jugadores ven tus canchas y horarios libres sin crear cuenta. Compártela por WhatsApp o redes.',
    slug: {
      label: 'Enlace de tu complejo',
      placeholder: 'cancha-la-70',
      hint: 'Quedará como /c/{{slug}}. Solo minúsculas, números y guiones.',
      fallback: 'tu-enlace',
    },
    saveLink: 'Guardar enlace',
    showPage: 'Mostrar mi página a los jugadores',
    unpublishedDone: 'Despublicaste el complejo. El enlace ya no abre.',
    publishedDone: 'Publicaste el complejo. Ya pueden verlo y reservar.',
    unpublishHelp:
      'Al despublicar, el enlace deja de abrir (error 404) y no entran reservas nuevas por ahí.',
    saveSlugFirst: 'Primero guarda el enlace de tu complejo.',
    missingIntro: 'Para publicar falta:',
    allReady: 'Todo listo. Al publicar, cualquiera con el enlace verá tus horarios.',
    previewSr: ' (vista previa, se abre en otra pestaña)',
    copyLink: 'Copiar enlace',
    previewNotFound: 'Mientras no publiques, la vista previa muestra “no encontrado”.',
    slugTaken: 'Ese enlace ya lo usa otro complejo. Prueba con otro.',
    saveFailed: 'No se pudo guardar. Intenta de nuevo.',
    sameSlug: 'Ese ya es el enlace de tu complejo.',
    linkSaved: 'Guardaste el enlace.',
    linkCopied: 'Enlace copiado.',
    copyFailed: 'No se pudo copiar. Selecciona el enlace y cópialo a mano.',
    errors: {
      slugRequired: 'Escribe el enlace de tu complejo.',
      slugMax: 'Usa máximo {{max}} caracteres.',
      slugPattern:
        'Usa solo minúsculas, números y guiones, sin guiones al inicio, al final ni repetidos.',
    },
  },
  openingHours: {
    title: 'Horarios de apertura',
    currentWeek: 'Semana actual',
    closed: 'Cerrado',
    slotLength: 'Turnos de {{duration}}.',
    applyToDays: 'Días a los que aplicar el horario',
    weekdaysShortcut: 'Lunes a viernes',
    allWeekShortcut: 'Toda la semana',
    eachDayStays: 'Cada día elegido queda',
    open: 'Abierto',
    opens: 'Abre',
    closes: 'Cierra',
    markClosed: 'Marcar como cerrado',
    saveHours: 'Guardar horarios',
    savedOpen: 'Guardaste {{open}}–{{close}} para {{names}} en {{pitch}}.',
    savedClosed:
      'Días cerrados en {{pitch}}: {{names}}. Los jugadores ya no verán turnos esos días.',
    alreadyClosedOne: 'El {{day}} ya estaba cerrado. No hubo cambios.',
    alreadyClosedMany: 'Esos días ya estaban cerrados. No hubo cambios.',
    saveFailed: 'No se pudieron guardar los horarios.',
    dialog: {
      title: '¿Cerrar estos días?',
      confirm: 'Sí, cerrar',
      dismiss: 'Volver',
      stopsOpening: '{{pitch}} dejará de abrir {{names}}.',
      body: 'Los jugadores ya no podrán reservar esos días. Las reservas ya hechas no se cancelan.',
    },
    errors: {
      noDays: 'Elige al menos un día.',
      closeAfterOpen: 'La hora de cierre debe ser posterior a la de apertura.',
    },
  },
  address: {
    legend: 'Dirección (opcional)',
    viaTipo: {
      label: 'Vía',
      placeholder: 'Tipo de vía',
    },
    viaNumero: {
      label: 'Número de la vía',
      hint: 'Ej. 72, 72A, 72 Bis Sur',
    },
    cruceNumero: {
      label: 'Número # (cruce)',
      hint: 'Lo que va después del #',
    },
    placaNumero: {
      label: 'Número - (placa)',
      hint: 'Lo que va después del guion',
    },
    municipio: {
      label: 'Municipio',
      hint: 'Ciudad o municipio',
    },
    departamento: {
      label: 'Departamento',
      hint: 'Ej. Antioquia',
    },
    barrio: {
      label: 'Barrio (opcional)',
      hint: 'Ayuda a ubicar el complejo',
    },
    complemento: {
      label: 'Complemento (opcional)',
      hint: 'Local, interior, referencia',
    },
    preview: 'Se verá así:',
    errors: {
      fallback: 'Revisa este campo.',
      viaTipo: {
        required: 'Elige el tipo de vía.',
      },
      viaNumero: {
        required: 'Escribe el número de la vía.',
        viaNumero: 'Usa un formato como 72, 72A o 72 Bis Sur.',
      },
      cruceNumero: {
        required: 'Escribe el número después del #.',
        cruceNumero: 'Usa solo el número, p. ej. 10 o 10A.',
      },
      placaNumero: {
        required: 'Escribe el número después del guion.',
        placaNumero: 'Usa solo números, hasta 3 dígitos.',
      },
      complemento: {
        tooLong: 'Usa máximo 80 caracteres.',
      },
      barrio: {
        tooLong: 'Usa máximo 80 caracteres.',
      },
      municipio: {
        required: 'Escribe el municipio.',
        tooShort: 'Escribe al menos 2 letras.',
        tooLong: 'Usa máximo 80 caracteres.',
      },
      departamento: {
        required: 'Escribe el departamento.',
        tooShort: 'Escribe al menos 2 letras.',
        tooLong: 'Usa máximo 80 caracteres.',
      },
    },
  },
  pitchPolicy: {
    title: 'Condiciones de reserva de esta cancha',
    intro:
      'Deja un campo vacío para usar el valor del complejo. Las reservas ya hechas conservan sus condiciones.',
    inheritedHint: 'Usa el del complejo: {{value}}.',
    ownHint: 'Valor propio de esta cancha.',
    inheritedHintPlural: 'Usa las del complejo.',
    ownHintPlural: 'Propias de esta cancha.',
    sameAsVenue: 'Igual al complejo ({{policy}})',
    save: 'Guardar condiciones',
    saved: 'Guardaste las condiciones de {{pitch}}. Los campos vacíos usan las del complejo.',
    saveFailed: 'No se pudieron guardar las condiciones.',
  },
  createPitch: {
    title: 'Nueva cancha en {{venue}}',
    name: {
      label: 'Nombre de la cancha',
      placeholder: 'Ej.: Cancha 1',
    },
    sport: 'Deporte',
    capacity: 'Capacidad (jugadores)',
    duration: 'Duración del turno (minutos)',
    add: 'Agregar cancha',
    created: 'Agregaste “{{name}}”. Define su precio y sus horarios arriba.',
    failed: 'No se pudo crear la cancha.',
    errors: {
      name: 'El nombre de la cancha necesita al menos 2 caracteres.',
      capacity: 'La capacidad debe estar entre 1 y 100 jugadores.',
    },
  },
  identity: {
    title: 'Datos del complejo',
    nameHint: 'Es el nombre que ven los jugadores.',
    previousAddress: 'Dirección anterior:',
    replaceHint: '. Completa los campos para reemplazarla.',
    save: 'Guardar datos',
    saved: 'Datos del complejo guardados.',
    saveFailed: 'No se pudieron guardar los datos del complejo.',
  },
  price: {
    title: 'Precio por turno',
    label: 'Precio de un turno de {{duration}} ({{currency}})',
    placeholder: '120.000',
    hintPreview: 'Los jugadores verán {{price}}. El anticipo se calcula sobre este valor.',
    hintEmpty:
      'Sin precio, los jugadores ven “Precio a confirmar con el complejo” y la reserva se confirma sin anticipo.',
    rules_one: 'Esta cancha tiene 1 tarifa por horario (hora pico). Se conservan al guardar.',
    rules_other:
      'Esta cancha tiene {{count}} tarifas por horario (hora pico). Se conservan al guardar.',
    save: 'Guardar precio',
    saved: '{{pitch}} cuesta {{price}} por turno.',
    savedNoBase:
      '{{pitch}} quedó sin precio base: fuera de las tarifas por horario, los jugadores verán “Precio a confirmar con el complejo”.',
    savedNoPrice:
      '{{pitch}} quedó sin precio: los jugadores verán “Precio a confirmar con el complejo”.',
    saveFailed: 'No se pudo guardar el precio.',
    errors: {
      amount: 'Escribe un precio válido, p. ej. 120.000 (máximo 21.474.836).',
    },
  },
  priceRules: {
    title: 'Tarifas por día y horario',
    intro:
      'Una tarifa reemplaza el precio base en los turnos que empiezan dentro de su horario. Las tarifas no pueden solaparse.',
    none: 'Sin tarifas: todos los turnos cuestan el precio base.',
    days: 'Tarifa {{n}} · días',
    from: 'Desde',
    to: 'Hasta (00:00 = medianoche)',
    priceLabel: 'Precio por turno ({{currency}})',
    pricePlaceholder: '150.000',
    priceExample: 'Ej. 150.000',
    remove: 'Quitar tarifa {{n}}',
    add: 'Agregar tarifa',
    save: 'Guardar tarifas',
    savedNone: '{{pitch}} ya no tiene tarifas por horario.',
    saved_one: 'Guardaste {{count}} tarifa para {{pitch}}.',
    saved_other: 'Guardaste {{count}} tarifas para {{pitch}}.',
    saveFailed: 'No se pudieron guardar las tarifas.',
    effectiveTitle: 'Precio efectivo por turno',
    effectiveNoPrice:
      'Sin precio base ni tarifas: los jugadores verán “Precio a confirmar con el complejo”.',
    effectiveNoHours: 'Define los horarios de apertura para ver el precio de cada turno.',
    noSlots: 'sin turnos',
    errors: {
      ruleN: 'Regla {{n}}: {{message}}',
      overlap: 'Las reglas {{a}} y {{b}} se solapan: comparten día y horario.',
      noDays: 'Elige al menos un día.',
      noTimes: 'Elige hora de inicio y de fin.',
      endBeforeStart: 'La hora de fin debe ser posterior a la de inicio.',
      badPrice: 'Escribe un precio válido.',
    },
  },
  createVenue: {
    title: 'Nuevo complejo',
    timezone: {
      label: 'Zona horaria del complejo',
      hint: 'Los horarios de las canchas se muestran en esta hora.',
    },
    create: 'Crear complejo',
    creating: 'Creando…',
    created: 'Creaste “{{name}}”. Ahora agrega sus canchas.',
    failed: 'No se pudo crear el complejo.',
  },
  slotDuration: {
    title: 'Duración del turno',
    label: 'Minutos por turno',
    hint: 'Cada reserva dura esto. Las reservas ya hechas conservan su horario.',
    unchanged: 'La duración ya era esa. No hubo cambios.',
    saved: 'Los turnos de {{pitch}} ahora duran {{duration}}.',
    save: 'Guardar duración',
    failed: 'No se pudo guardar la duración del turno.',
  },
  integration: {
    title: 'Pendiente de integración',
    simulated: 'simulado',
    manual: 'manual',
  },
};
