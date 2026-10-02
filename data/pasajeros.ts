// data/pasajeros.ts
// data/pasajeros.ts



export interface OpcionEncuesta {
  id: string;
  categoria: "halago" | "queja";
  icono: string;
  texto: string;
  colorBg: string;
  imagenFondo?: string;
}

// -------------------------------------------------------------
// BANNER DE INFORMACIÓN TIA
// -------------------------------------------------------------
export const TIA_INFO_BANNER = {
  titulo: "💡 ¿Necesitas ayuda presencial?",
  mensaje: "Cualquier persona que porte una credencial oficial TIA (prestadores de servicios, seguridad y atención) está capacitada y obligada a auxiliarte y guiarte de la mano dentro de las instalaciones del aeropuerto. ¡Acércate con total confianza!"
};

// -------------------------------------------------------------
// DIRECTORIO / ENCUESTA INTERACTIVA (20 BOTONES)
// -------------------------------------------------------------
export const OPCIONES_ENCUESTA: OpcionEncuesta[] = [
  // 10 HALAGOS
  { id: "h1", categoria: "halago", icono: "🧼", texto: "El baño que usé estaba impecable y temático", colorBg: "bg-emerald-900/40" },
  { id: "h2", categoria: "halago", icono: "🤝", texto: "Un colaborador con TIA me acompañó amablemente", colorBg: "bg-teal-900/40" },
  { id: "h3", categoria: "halago", icono: "⚡", texto: "Pasé el filtro de seguridad rapidísimo", colorBg: "bg-green-900/40" },
  { id: "h4", categoria: "halago", icono: "✈️️", texto: "La señalización para mi sala fue muy clara", colorBg: "bg-cyan-900/40" },
  { id: "h5", categoria: "halago", icono: "📱", texto: "La app me ahorró tiempo y confusión", colorBg: "bg-blue-900/40" },
  { id: "h6", categoria: "halago", icono: "🥐", texto: "La zona comercial y restaurantes superaron mis expectativas", colorBg: "bg-indigo-900/40" },
  { id: "h7", categoria: "halago", icono: "🚍", texto: "El acceso al Mexibús / Transporte fue muy fácil", colorBg: "bg-emerald-900/40" },
  { id: "h8", categoria: "halago", icono: "♿", texto: "Excelente atención para personas de la tercera edad / movilidad", colorBg: "bg-teal-900/40" },
  { id: "h9", categoria: "halago", icono: "🏛️", texto: "Disfruté mucho el recorrido por los museos / zonas culturales", colorBg: "bg-blue-900/40" },
  { id: "h10", categoria: "halago", icono: "🌟", texto: "Mi experiencia general en el AIFA fue excelente", colorBg: "bg-cyan-900/40" },

  // 10 REPORTES Y COMENTARIOS CONSTRUCTIVOS
  { id: "q1", categoria: "queja", icono: "🛗", texto: "Encontré un elevador, escalera o máquina fuera de servicio", colorBg: "bg-amber-900/40" },
  { id: "q2", categoria: "queja", icono: "🚰", texto: "Un baño necesitaba limpieza o insumos (papel/jabón)", colorBg: "bg-orange-900/40" },
  { id: "q3", categoria: "queja", icono: "😐", texto: "Un prestador de servicio / personal TIA no me atendió bien", colorBg: "bg-rose-900/40" },
  { id: "q4", categoria: "queja", icono: "🚶‍♂️", texto: "Me costó trabajo encontrar mi puerta de abordaje / ubicación", colorBg: "bg-red-900/40" },
  { id: "q5", categoria: "queja", icono: "⏳", texto: "El filtro de seguridad / migración demoró demasiado", colorBg: "bg-amber-900/40" },
  { id: "q6", categoria: "queja", icono: "🧳", texto: "Tuve contratiempos en la banda de reclamación de equipaje", colorBg: "bg-orange-900/40" },
  { id: "q7", categoria: "queja", icono: "📶", texto: "Tuve problemas de conexión a internet / Wi-Fi", colorBg: "bg-rose-900/40" },
  { id: "q8", categoria: "queja", icono: "🚖", texto: "La fila o información del transporte / taxi fue confusa", colorBg: "bg-red-900/40" },
  { id: "q9", categoria: "queja", icono: "🏷️", texto: "Falta de claridad en los precios de locales o servicios", colorBg: "bg-amber-900/40" },
  { id: "q10", categoria: "queja", icono: "💡", texto: "Tengo una sugerencia para mejorar la aplicación o la terminal", colorBg: "bg-orange-900/40" }
];

// -------------------------------------------------------------
// RESPUESTAS PARA PANTALLA CÁLIDA
// -------------------------------------------------------------
export const RESPUESTAS_PANTALLA = {
  halago: {
    titulo: "¡Nos alegra muchísimo leer esto! 🎉",
    mensaje: "Tu reconocimiento nos motiva a mantener la excelencia en la experiencia de cada pasajero. Transmitiremos tus felicitaciones al equipo correspondiente.",
    placeholderTexto: "Si quieres agregar un mensaje especial o mencionar a alguien, escríbelo aquí (opcional):",
    imagenFondo: "/images/aifa-calido-halago.jpg"
  },
  queja: {
    titulo: "Te escuchamos y ya estamos trabajando en ello 🤝",
    mensaje: "Lamentamos mucho los inconvenientes. Tu reporte genera una alerta para que el personal operativo revise esta situación a la brevedad.",
    placeholderTexto: "Danos más detalles (ej. número de baño, área o número de gafete TIA) si lo deseas:",
    imagenFondo: "/images/aifa-calido-atencion.jpg"
  }
};
export interface PasoGuia {
  id: string;
  titulo: string;
  descripcion: string;
  sabiasQue?: string;
  imagenUrl?: string;
}

export interface SubModulo {
  id: string;
  titulo: string;
  descripcion: string;
  pasos: PasoGuia[];
}

// -------------------------------------------------------------
// 1. MÓDULO PASEO Y TURISMO
// -------------------------------------------------------------
export const TURISMO_DATA: SubModulo[] = [
  {
    id: "museos",
    titulo: "Corredor Cultural y Museos",
    descripcion: "Atractivos culturales dentro de la Base Aérea y zona aeroportuaria.",
    pasos: [
      {
        id: "tur-1",
        titulo: "Museo Paleontológico Quinamávida (Tierra de Gigantes)",
        descripcion: "Ubicado a unos minutos de la terminal. Exhibe restos de mamuts y megafauna descubiertos durante la construcción.",
        sabiasQue: "¡No necesitas pase de abordar para entrar! La entrada es gratuita y abierta a todo público.",
        imagenUrl: "/images/turismo/museo-mamut.jpg"
      },
      {
        id: "tur-2",
        titulo: "Museo de la Aviación Militar (MAM)",
        descripcion: "Colección histórica de aeronaves de la Fuerza Aérea Mexicana en exhibición interactiva.",
        sabiasQue: "Cuenta con un hangar real e interactivo ideal para ir en familia antes o después de esperar un vuelo.",
        imagenUrl: "/images/turismo/museo-aviacion.jpg"
      },
      {
        id: "tur-3",
        titulo: "Tren Histórico Olivo",
        descripcion: "Vagón presidencial histórico restaurado dentro del complejo militar.",
        imagenUrl: "/images/turismo/tren-olivo.jpg"
      }
    ]
  },
  {
    id: "banos-tematicos",
    titulo: "Ruta de Baños Temáticos",
    descripcion: "Experiencia visual única en los sanitarios públicos del aeropuerto.",
    pasos: [
      {
        id: "tur-4",
        titulo: "Sanitarios de Lucha Libre y Cine Mexicano",
        descripcion: "Murales y decoración dedicados a la cultura popular mexicana ubicados en pasillos principales.",
        sabiasQue: "Hay más de 30 baños temáticos con diseños diferentes (Catrinas, El Chavo, Mariachi, Maya, etc.).",
        imagenUrl: "/images/turismo/banos-tematicos.jpg"
      }
    ]
  }
];

// -------------------------------------------------------------
// 2. MÓDULO AYUDA RÁPIDA: TRANSPORTE Y MEXIBÚS
// -------------------------------------------------------------
export const TRANSPORTE_DATA: SubModulo[] = [
  {
    id: "mexibus",
    titulo: "Mexibús (Línea 1)",
    descripcion: "Conexión directa con Ojo de Agua y Ciudad Azteca.",
    pasos: [
      {
        id: "trans-1",
        titulo: "Llegada a la Terminal Mexibús AIFA",
        descripcion: "Se ubica en la planta baja / nivel inferior de la terminal de pasajeros.",
        sabiasQue: "El pago se realiza mediante la tarjeta Mexipase. Puedes adquirirla y recargarla en las máquinas del acceso."
      },
      {
        id: "trans-2",
        titulo: "Abordaje y Recorrido",
        descripcion: "Las unidades salen con frecuencia regular hacia las estaciones de interconexión con el Estado de México y CDMX."
      }
    ]
  },
  {
    id: "taxis-autobuses",
    titulo: "Taxis Autorizados y Autobuses Foráneos",
    descripcion: "Opciones de movilidad terrestre hacia CDMX y estados vecinos.",
    pasos: [
      {
        id: "trans-3",
        titulo: "Taquillas de Taxis Autorizados",
        descripcion: "Ubicadas en el área pública de llegadas. Paga únicamente en los módulos oficiales antes de abordar.",
        sabiasQue: "Nunca abordes un taxi fuera de la zona autorizada o sin boleto pagado previamente en taquilla por tu seguridad."
      },
      {
        id: "trans-4",
        titulo: "Terminal de Autobuses (Foráneos)",
        descripcion: "Conexiones directas a Puebla, Querétaro, Pachuca, Toluca y terminales de CDMX (TAPO, Norte, Sur)."
      }
    ]
  }
];