import {
  Backpack,
  Bus,
  Car,
  Landmark,
  Luggage,
  PawPrint,
  Plane,
  PlaneTakeoff,
  ShieldCheck,
  TrainFront,
  UsersRound,
  type LucideIcon
} from 'lucide-react';

export type MenuAction =
  | 'arrival'
  | 'departure'
  | 'pickup'
  | 'tourism'
  | 'transport'
  | 'lost-items'
  | 'pets';

export type MenuSectionId =
  | 'flights'
  | 'ground-transport'
  | 'passenger-services'
  | 'culture-museums'
  | 'pets-regulations';

type MenuSectionItemBase = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type MenuSectionItem = MenuSectionItemBase & (
  | { href: string; action?: never }
  | { action: MenuAction; href?: never }
);

export interface MenuSection {
  id: MenuSectionId;
  title: string;
  description: string;
  icon: LucideIcon;
  items: MenuSectionItem[];
}

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: 'flights',
    title: 'Vuelos & Aerolíneas',
    description: 'Consulta orientación para llegadas, salidas y servicios de las aerolíneas.',
    icon: Plane,
    items: [
      {
        id: 'arrivals',
        title: 'Llegadas y equipaje',
        description: 'Ubica los pasos y servicios para continuar tu recorrido al llegar.',
        action: 'arrival',
        icon: Luggage
      },
      {
        id: 'departures',
        title: 'Salidas y abordaje',
        description: 'Prepárate para documentar, pasar filtros y ubicar tu puerta.',
        action: 'departure',
        icon: PlaneTakeoff
      },
      {
        id: 'airlines',
        title: 'Aerolíneas',
        description: 'Visita el sitio oficial del aeropuerto para información de aerolíneas.',
        href: 'https://aifa.aero',
        icon: ShieldCheck
      }
    ]
  },
  {
    id: 'ground-transport',
    title: 'Transporte Terrestre',
    description: 'Encuentra opciones para llegar, salir y desplazarte desde el aeropuerto.',
    icon: Bus,
    items: [
      {
        id: 'public-transport',
        title: 'Mexibús y transporte público',
        description: 'Consulta rutas, puntos de abordaje y recomendaciones de transporte.',
        action: 'transport',
        icon: TrainFront
      },
      {
        id: 'taxis-and-buses',
        title: 'Taxis y autobuses',
        description: 'Revisa la orientación disponible sobre opciones de transporte terrestre.',
        action: 'transport',
        icon: Car
      },
      {
        id: 'meeting-point',
        title: 'Punto de encuentro',
        description: 'Organiza la recepción de pasajeros en la terminal.',
        action: 'pickup',
        icon: UsersRound
      }
    ]
  },
  {
    id: 'passenger-services',
    title: 'Servicios al Pasajero',
    description: 'Accede a orientación, asistencia y servicios útiles durante tu visita.',
    icon: Luggage,
    items: [
      {
        id: 'passenger-guidance',
        title: 'Orientación al pasajero',
        description: 'Encuentra indicaciones para equipaje, servicios y salida de la terminal.',
        action: 'arrival',
        icon: Plane
      },
      {
        id: 'lost-items',
        title: 'Objetos olvidados',
        description: 'Consulta los pasos para reportar o recuperar pertenencias.',
        action: 'lost-items',
        icon: Backpack
      }
    ]
  },
  {
    id: 'culture-museums',
    title: 'Cultura & Museos',
    description: 'Explora los espacios culturales y atractivos de la zona aeroportuaria.',
    icon: Landmark,
    items: [
      {
        id: 'museums',
        title: 'Museos y corredor cultural',
        description: 'Conoce los museos y espacios históricos de la zona.',
        action: 'tourism',
        icon: Landmark
      },
      {
        id: 'themed-restrooms',
        title: 'Baños temáticos',
        description: 'Descubre los sanitarios con diseños inspirados en la cultura mexicana.',
        action: 'tourism',
        icon: Landmark
      }
    ]
  },
  {
    id: 'pets-regulations',
    title: 'Mascotas/Normativas',
    description: 'Consulta recomendaciones y orientación para viajar con mascotas.',
    icon: PawPrint,
    items: [
      {
        id: 'traveling-with-pets',
        title: 'Viajar con mascotas',
        description: 'Revisa recomendaciones para preparar el viaje de tu mascota.',
        action: 'pets',
        icon: PawPrint
      },
      {
        id: 'pet-regulations',
        title: 'Normativas y requisitos',
        description: 'Consulta orientación sobre requisitos y preparación antes del viaje.',
        action: 'pets',
        icon: ShieldCheck
      }
    ]
  }
];
