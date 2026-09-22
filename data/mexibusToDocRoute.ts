export interface RouteStep {
  stepNumber: number;
  stage: string;
  title: string;
  description: string;
  referencePoint?: string;
  image: string;
  accessibilityNote?: string;
}

export const mexibusToDocRoute: RouteStep[] = [
  {
    stepNumber: 1,
    stage: "Estación Mexibús",
    title: "Llegada y salida por torniquetes",
    description: "Llegas a la estación 'Terminal de Pasajeros' (última estación) y sales por los torniquetes de salida para avanzar.",
    referencePoint: "Piso podotáctil con franjas amarillas en relieve para guía visual/láctil.",
    image: "/images/rutas/mexibus-doc/paso-01.jpg",
    accessibilityNote: "Línea podotáctil presente en todo el trayecto inicial."
  },
  {
    stepNumber: 2,
    stage: "Explanada de Conexión",
    title: "Giro a la izquierda y paso peatonal",
    description: "Avanza de 12 a 15 metros al frente y gira a la izquierda siguiendo la línea podotáctil. Cruza el paso cebra con precaución.",
    referencePoint: "Bolardos lumínicos y bolardos metálicos de seguridad con franja reflectante.",
    image: "/images/rutas/mexibus-doc/paso-02.jpg"
  },
  {
    stepNumber: 3,
    stage: "Área de Estacionamiento y Tren",
    title: "Tránsito por pasillo de columnas (F a C)",
    description: "Cruza la cebra del estacionamiento. A tu derecha verás las columnas por área. Cruzando a la derecha queda la entrada/salida del Tren Suburbano y la Terminal de Autobuses.",
    referencePoint: "Columnas marcadas con letras D y F, maceteros perimetrales.",
    image: "/images/rutas/mexibus-doc/paso-03.jpg"
  },
  {
    stepNumber: 4,
    stage: "Ingreso al Edificio Terminal",
    title: "Acceso por Puerta 5 (Llegadas)",
    description: "Continúa pasando las columnas C, B y A. Gira ligeramente a la izquierda para ingresar por la Puerta 5 'Llegadas / Arrivals'.",
    referencePoint: "Escultura gigante de dinosaurio volador (Pterodáctilo) suspendido en el techo.",
    image: "/images/rutas/mexibus-doc/paso-04.jpg"
  },
  {
    stepNumber: 5,
    stage: "Ascenso a Salidas",
    title: "Escaleras eléctricas a Vuelos de Salida",
    description: "Cruza las puertas automáticas y gira a la izquierda. Toma las escaleras eléctricas señalizadas hacia 'Vuelos de Salida'.",
    referencePoint: "Letrero 'Vuelos de Salida' al inicio de las escaleras.",
    image: "/images/rutas/mexibus-doc/paso-05.jpg"
  },
  {
    stepNumber: 6,
    stage: "Área de Documentación",
    title: "Llegada a mostradores de equipaje",
    description: "Al subir las escaleras, gira a la derecha. Encontrarás los módulos de documentación de equipaje nacionales e internacionales.",
    referencePoint: "Módulos de Check-in y mostradores de aerolíneas.",
    image: "/images/rutas/mexibus-doc/paso-06.jpg"
  }
];
