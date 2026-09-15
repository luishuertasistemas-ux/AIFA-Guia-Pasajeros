import { Location, NavigationRoute } from '../types/location';

export const MOCK_LOCATIONS: Record<string, Location> = {
  'entrada-principal': {
    id: 'entrada-principal',
    name: 'Entrada Principal - Acceso A',
    level: 'Nivel 1',
    zone: 'Zona Principal',
    category: 'servicio'
  },
  'filtro-seguridad': {
    id: 'filtro-seguridad',
    name: 'Filtro de Seguridad Central',
    level: 'Nivel 2',
    zone: 'Zona Centro',
    category: 'servicio'
  },
  'puerta-105': {
    id: 'puerta-105',
    name: 'Puerta de Abordaje 105',
    level: 'Nivel 2',
    zone: 'Zona Norte',
    category: 'puerta'
  },
  'puerta-108': {
    id: 'puerta-108',
    name: 'Puerta de Abordaje 108',
    level: 'Nivel 2',
    zone: 'Zona Sur',
    category: 'puerta'
  },
  'banos-lucha-libre': {
    id: 'banos-lucha-libre',
    name: 'Sanitarios Temáticos (Lucha Libre)',
    level: 'Nivel 2',
    zone: 'Zona Norte',
    category: 'bano'
  },
  'sala-vip': {
    id: 'sala-vip',
    name: 'Sala VIP Centurion',
    level: 'Nivel 2',
    zone: 'Zona Centro',
    category: 'restaurante'
  }
};

export const MOCK_ROUTES: Record<string, NavigationRoute> = {
  'entrada-principal-puerta-105': {
    originId: 'entrada-principal',
    destinationId: 'puerta-105',
    estimatedMinutes: 8,
    steps: [
      { step: 1, instruction: 'Ingresa por los detectores del Acceso A.' },
      { step: 2, instruction: 'Toma las escaleras eléctricas hacia el Nivel 2.' },
      { step: 3, instruction: 'Pasa por el Filtro de Seguridad Central.' },
      { step: 4, instruction: 'Gira a la izquierda en el pasillo principal hacia la Zona Norte.' },
      { step: 5, instruction: 'Camina 150 metros. La Puerta 105 estará a tu derecha.' }
    ]
  },
  'filtro-seguridad-banos-lucha-libre': {
    originId: 'filtro-seguridad',
    destinationId: 'banos-lucha-libre',
    estimatedMinutes: 3,
    steps: [
      { step: 1, instruction: 'Camina hacia el pasillo de la Zona Norte.' },
      { step: 2, instruction: 'Los sanitarios temáticos están a 50 metros a la izquierda.' }
    ]
  }
};