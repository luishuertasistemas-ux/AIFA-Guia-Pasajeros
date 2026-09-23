import type { Location, NavigationRoute } from '../types/location';

export const MOCK_LOCATIONS: Record<string, Location> = {
  'entrada-principal': {
    id: 'entrada-principal',
    category: 'servicios',
    translations: {
      ES: { title: 'Entrada Principal - Acceso A', description: 'Punto de acceso principal al aeropuerto.' },
      EN: { title: 'Main Entrance - Access A', description: 'Main access point to the airport.' },
      FR: { title: 'Entrée principale - Accès A', description: 'Point d’accès principal de l’aéroport.' },
      ZH: { title: '主入口 - A 入口', description: '机场的主要入口。' }
    },
    walkTime: '0 min a pie',
    images: ['/images/hero-manana.jpg', '/images/hero-tarde.jpg'],
    mapZone: 'Nivel 1 - Zona Principal'
  },
  'filtro-seguridad': {
    id: 'filtro-seguridad',
    category: 'servicios',
    translations: {
      ES: { title: 'Filtro de Seguridad Central', description: 'Punto de inicio del flujo de pasajeros.' },
      EN: { title: 'Central Security Checkpoint', description: 'Starting point for the passenger flow.' },
      FR: { title: 'Contrôle de sécurité central', description: 'Point de départ du parcours des passagers.' },
      ZH: { title: '中央安检处', description: '旅客流程的起点。' }
    },
    walkTime: '3 min a pie',
    images: ['/images/hero-tarde.jpg', '/images/hero-manana.jpg'],
    mapZone: 'Nivel 2 - Concourse Central'
  },
  'banos-mujeres-nivel-1': {
    id: 'banos-mujeres-nivel-1',
    category: 'servicios',
    translations: {
      ES: { title: 'Sanitarios de Mujeres - Nivel 1', description: 'Baños de mujeres cerca de la zona comercial.' },
      EN: { title: 'Women’s Restrooms - Level 1', description: 'Women’s restrooms near the shopping zone.' },
      FR: { title: 'Toilettes pour femmes - Niveau 1', description: 'Toilettes pour femmes près de la zone commerciale.' },
      ZH: { title: '女洗手间 - 1层', description: '位于商业区附近的女洗手间。' }
    },
    walkTime: '5 min a pie',
    images: ['/images/hero-noche.jpg', '/images/hero-manana.jpg'],
    mapZone: 'Nivel 1 - Zona Comercial',
    quickTip: {
      ES: 'Los baños de mujeres están en el Nivel 1, cerca de la zona comercial.',
      EN: 'The women’s restrooms are on Level 1, near the shopping zone.',
      FR: 'Les toilettes pour femmes sont au niveau 1, près de la zone commerciale.',
      ZH: '女洗手间位于1层，靠近商业区。'
    }
  },
  'puerta-105': {
    id: 'puerta-105',
    category: 'puertas',
    translations: {
      ES: { title: 'Puerta de Abordaje 105', description: 'Puerta de embarque en la zona norte.' },
      EN: { title: 'Boarding Gate 105', description: 'Boarding gate in the north zone.' },
      FR: { title: 'Porte d’embarquement 105', description: 'Porte d’embarquement dans la zone nord.' },
      ZH: { title: '105号登机口', description: '位于北区的登机口。' }
    },
    walkTime: '8 min a pie',
    images: ['/images/hero-tarde.jpg', '/images/hero-noche.jpg'],
    mapZone: 'Nivel 2 - Concourse Norte'
  },
  'puerta-108': {
    id: 'puerta-108',
    category: 'puertas',
    translations: {
      ES: { title: 'Puerta de Abordaje 108', description: 'Puerta de embarque en la zona sur.' },
      EN: { title: 'Boarding Gate 108', description: 'Boarding gate in the south zone.' },
      FR: { title: 'Porte d’embarquement 108', description: 'Porte d’embarquement dans la zone sud.' },
      ZH: { title: '108号登机口', description: '位于南区的登机口。' }
   },
    walkTime: '10 min a pie',
    images: ['/images/hero-noche.jpg', '/images/hero-tarde.jpg'],
    mapZone: 'Nivel 2 - Concourse Sur'
  },
  'banos-lucha-libre': {
    id: 'banos-lucha-libre',
    category: 'servicios',
    translations: {
      ES: { title: 'Sanitarios Temáticos (Lucha Libre)', description: 'Baños únicos inspirados en la lucha libre.' },
      EN: { title: 'Themed Restrooms (Lucha Libre)', description: 'Unique restrooms inspired by lucha libre.' },
      FR: { title: 'Toilettes thématiques (Lucha Libre)', description: 'Toilettes uniques inspirées de la lucha libre.' },
      ZH: { title: '主题洗手间（自由摔跤）', description: '以自由摔跤为主题的特色洗手间。' }
    },
    walkTime: '3 min a pie',
    images: ['/images/hero-noche.jpg', '/images/hero-manana.jpg'],
    mapZone: 'Nivel 2 - Concourse Norte'
  },
  'sala-vip': {
    id: 'sala-vip',
    category: 'comida',
    translations: {
      ES: { title: 'Sala VIP Centurion', description: 'Sala exclusiva con comida y servicios para viajeros.' },
      EN: { title: 'Centurion VIP Lounge', description: 'Exclusive lounge with food and traveler services.' },
      FR: { title: 'Salon VIP Centurion', description: 'Salon exclusif avec restauration et services.' },
      ZH: { title: 'Centurion 贵宾休息室', description: '提供餐饮和旅客服务的专属休息室。' }
    },
    walkTime: '6 min a pie',
    images: ['/images/hero-tarde.jpg', '/images/museo-mamut.jpg'],
    mapZone: 'Nivel 2 - Concourse Central'
  },
  'museo-mamut': {
    id: 'museo-mamut',
    category: 'turismo',
    translations: {
      ES: { title: 'Museo del Mamut (Tierra de Gigantes)', description: 'Zona cultural y paleontológica con fósiles monumentales.' },
      EN: { title: 'Mammoth Museum (Land of Giants)', description: 'Cultural and paleontological space with monumental fossils.' },
      FR: { title: 'Musée du Mammouth (Terre des Géants)', description: 'Espace culturel et paléontologique avec des fossiles monumentaux.' },
      ZH: { title: '猛犸象博物馆（巨人之地）', description: '展示巨型化石的文化与古生物空间。' }
    },
    walkTime: '5 min a pie',
    images: ['/images/museo-mamut.jpg', '/images/hero-manana.jpg'],
    mapZone: 'Nivel 1 - Zona Cultural'
  },
  'museo-aviacion-militar': {
    id: 'museo-aviacion-militar',
    category: 'turismo',
    translations: {
      ES: { title: 'Museo de la Aviación Militar (MAM)', description: 'Hangares interactivos y aeronaves históricas.' },
      EN: { title: 'Military Aviation Museum (MAM)', description: 'Interactive hangars and historic aircraft.' },
      FR: { title: 'Musée de l’aviation militaire (MAM)', description: 'H hangars interactifs et avions historiques.' },
      ZH: { title: '军事航空博物馆（MAM）', description: '互动机库与历史飞机展览。' }
    },
    walkTime: '12 min a pie',
    images: ['/images/hero-tarde.jpg', '/images/hero-noche.jpg'],
    mapZone: 'Nivel 1 - Zona de Hangares'
  },
  'tren-presidencial-olmecas': {
    id: 'tren-presidencial-olmecas',
    category: 'turismo',
    translations: {
      ES: { title: 'Tren Presidencial Olmecas', description: 'Vagón histórico y área temática para descubrir.' },
      EN: { title: 'Olmecas Presidential Train', description: 'Historic railway car and themed area to explore.' },
      FR: { title: 'Train présidentiel Olmecas', description: 'Wagon historique et espace thématique à découvrir.' },
      ZH: { title: '奥尔梅克总统列车', description: '历史车厢与主题体验区。' }
    },
    walkTime: '9 min a pie',
    images: ['/images/hero-manana.jpg', '/images/museo-mamut.jpg'],
    mapZone: 'Nivel 1 - Zona Histórica'
  },
  'plaza-mexicana': {
    id: 'plaza-mexicana',
    category: 'comida',
    translations: {
      ES: { title: 'Plaza Mexicana / Zona Comercial', description: 'Punto central de distribución a salas, tiendas y restaurantes.' },
      EN: { title: 'Mexican Plaza / Shopping Zone', description: 'Central distribution point for lounges, shops, and restaurants.' },
      FR: { title: 'Plaza Mexicana / Zone commerciale', description: 'Point central vers les salons, boutiques et restaurants.' },
      ZH: { title: '墨西哥广场 / 商业区', description: '通往休息室、商店和餐厅的中心区域。' }
    },
    walkTime: '4 min a pie',
    images: ['/images/hero-tarde.jpg', '/images/hero-manana.jpg'],
    mapZone: 'Nivel 1 - Concourse Central'
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

export const BOARDING_GATES = Array.from({ length: 12 }, (_, index) => `puerta-${101 + index}`);

const BOARDING_GATE_WALK_MINUTES: Record<string, Record<string, number>> = {
  'entrada-principal': {
    'puerta-101': 7,
    'puerta-102': 7,
    'puerta-103': 8,
    'puerta-104': 8,
    'puerta-105': 8,
    'puerta-106': 9,
    'puerta-107': 9,
    'puerta-108': 10,
    'puerta-109': 10,
    'puerta-110': 11,
    'puerta-111': 11,
    'puerta-112': 12
  },
  'filtro-seguridad': {
    'puerta-101': 4,
    'puerta-102': 4,
    'puerta-103': 5,
    'puerta-104': 5,
    'puerta-105': 6,
    'puerta-106': 6,
    'puerta-107': 7,
    'puerta-108': 7,
    'puerta-109': 8,
    'puerta-110': 8,
    'puerta-111': 9,
    'puerta-112': 9
  }
};

export function getEstimatedWalkingMinutes(originId: string, gateId: string): number {
  const route = MOCK_ROUTES[`${originId}-${gateId}`];
  if (route) return route.estimatedMinutes;

  const matrixValue = BOARDING_GATE_WALK_MINUTES[originId]?.[gateId];
  if (matrixValue) return matrixValue;

  return BOARDING_GATE_WALK_MINUTES['entrada-principal'][gateId] || 10;
}