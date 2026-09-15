import { Location, NavigationRoute } from '@/types/location';

export const AIRPORT_LOCATIONS: Location[] = [
  // --- Puntos de Escaneo / Origen ---
  {
    id: 'entrada-principal',
    name: 'Entrada Principal - Acceso A',
    category: 'servicio',
    terminal: 'Terminal Pasajeros',
    level: 1,
    zone: 'Principal',
    description: 'Frente a los mostradores de documentación.'
  },
  {
    id: 'filtro-seguridad',
    name: 'Filtro de Seguridad Central',
    category: 'servicio',
    terminal: 'Terminal Pasajeros',
    level: 2,
    zone: 'Centro',
    description: 'Salida del área de inspección de equipaje.'
  },

  // --- Destinos: Puertas de Abordaje ---
  {
    id: 'puerta-105',
    name: 'Puerta de Abordaje 105',
    category: 'puerta',
    terminal: 'Terminal Pasajeros',
    level: 2,
    zone: 'Norte'
  },
  {
    id: 'puerta-108',
    name: 'Puerta de Abordaje 108',
    category: 'puerta',
    terminal: 'Terminal Pasajeros',
    level: 2,
    zone: 'Sur'
  },

  // --- Destinos: Servicios y Sanitarios ---
  {
    id: 'banos-lucha-libre',
    name: 'Sanitarios Temáticos (Lucha Libre)',
    category: 'bano',
    terminal: 'Terminal Pasajeros',
    level: 2,
    zone: 'Norte',
    description: 'Pasillo principal norte, cerca de la puerta 104.'
  },
  {
    id: 'sala-vip',
    name: 'Sala VIP Centurion',
    category: 'restaurante',
    terminal: 'Terminal Pasajeros',
    level: 2,
    zone: 'Centro',
    description: 'Planta alta, mezzanine central.'
  }
];

// Rutas de ejemplo para simular la navegación
export const MOCK_ROUTES: Record<string, NavigationRoute> = {
  'entrada-principal_puerta-105': {
    originId: 'entrada-principal',
    destinationId: 'puerta-105',
    estimatedMinutes: 5,
    steps: [
      { step: 1, instruction: 'Avanza recto hacia las escaleras eléctricas.', distanceMeters: 50 },
      { step: 2, instruction: 'Sube al Nivel 2 (Filtro de seguridad).', distanceMeters: 20 },
      { step: 3, instruction: 'Gira a la izquierda dirigiéndote a la Zona Norte.', distanceMeters: 100 },
      { step: 4, instruction: 'Camina hasta encontrar la Puerta 105 a tu derecha.', distanceMeters: 80 }
    ]
  },
  'filtro-seguridad_banos-lucha-libre': {
    originId: 'filtro-seguridad',
    destinationId: 'banos-lucha-libre',
    estimatedMinutes: 3,
    steps: [
      { step: 1, instruction: 'Camina hacia el pasillo comercial de la Zona Norte.', distanceMeters: 60 },
      { step: 2, instruction: 'Los sanitarios temáticos están a la izquierda junto a la tienda oficial.', distanceMeters: 40 }
    ]
  }
};