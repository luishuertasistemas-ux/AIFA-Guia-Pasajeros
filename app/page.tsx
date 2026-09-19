'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, Suspense } from 'react';
import { MOCK_LOCATIONS, MOCK_ROUTES } from '../data/locations';

type HeroPeriod = 'manana' | 'tarde' | 'noche';
type Language = 'ES' | 'EN' | 'FR' | 'ZH';
type QuickTipKey = 'bathrooms' | 'food' | 'museum' | 'security';
type SpeechSynthesisLocale = 'es-MX' | 'en-US' | 'fr-FR' | 'zh-CN';
type SpeechRecognitionEventLike = {
  results: { [index: number]: { [index: number]: { transcript: string } } };
};
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type LanguageOption = {
  code: Language;
  label: string;
  flag: string;
  locale: SpeechSynthesisLocale;
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type Attraction = {
  key: 'museo' | 'torre' | 'banos';
  image: string;
  searchTerm: string;
};

type Translation = {
  hero: Record<HeroPeriod, { title: string; subtitle: string; badge: string }>;
  origin: string;
  explore: string;
  discover: string;
  swipe: string;
  destination: string;
  search: string;
  searchLabel: string;
  clearSearch: string;
  categories: string[];
  museum: { name: string; description: string; badge: string };
  locationCategories: Record<string, string>;
  locations: Record<string, { name: string; level: string; zone: string }>;
  actionGo: string;
  noCategoryResults: string;
  noSearchResults: (term: string) => string;
  changeDestination: string;
  routeTo: string;
  estimatedTime: string;
  walkingMinutes: (minutes: number) => string;
  routeBuilding: string;
  routeSuggestions: string;
  routeSteps: Record<string, string[]>;
  attractions: Record<string, { name: string; description: string; badge: string; label?: string; schedule?: string }>;
  quickActions: { bathrooms: string; food: string; search: string; label: string };
  languageNames: Record<Language, string>;
  actionDetails: string;
  quickTips: {
    title: string;
    answerLabel: string;
    walkingLabel: string;
    notice: string;
    questions: Record<QuickTipKey, string>;
    answers: Record<QuickTipKey, string>;
  };
  voice: {
    buttonLabel: string;
    listening: string;
    unsupported: string;
    noMatch: string;
    responsePrefix: string;
    quickTipPrefix: string;
  };
};

const QUICK_TIP_DESTINATIONS: Record<QuickTipKey, { id: string; minutes: number }> = {
  bathrooms: { id: 'banos-mujeres-nivel-1', minutes: 5 },
  food: { id: 'plaza-mexicana', minutes: 4 },
  museum: { id: 'museo-mamut', minutes: 5 },
  security: { id: 'filtro-seguridad', minutes: 3 }
};

const HERO_CONFIG: Record<HeroPeriod, { image: string }> = {
  manana: { image: '/images/hero-manana.jpg' },
  tarde: { image: '/images/hero-tarde.jpg' },
  noche: { image: '/images/hero-noche.jpg' }
};

const HERO_SLIDES = Object.values(HERO_CONFIG);
const HERO_PERIODS: HeroPeriod[] = ['manana', 'tarde', 'noche'];

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'ES', label: 'Español', flag: '🇲🇽', locale: 'es-MX' },
  { code: 'EN', label: 'English', flag: '🇺🇸', locale: 'en-US' },
  { code: 'FR', label: 'Français', flag: '🇫🇷', locale: 'fr-FR' },
  { code: 'ZH', label: '中文', flag: '🇨🇳', locale: 'zh-CN' }
];

const SPEECH_SYNTHESIS_LOCALES: Record<Language, SpeechSynthesisLocale> = {
  ES: 'es-MX',
  EN: 'en-US',
  FR: 'fr-FR',
  ZH: 'zh-CN'
};

const translations: Record<Language, Translation> = {
  ES: {
    hero: {
      manana: { title: '¡Buenos días! Bienvenido al AIFA', subtitle: 'Explora la terminal bajo la luz de la mañana.', badge: '🌅 Mañana' },
      tarde: { title: '¡Buenas tardes! Explora tu terminal', subtitle: 'Encuentra tus puertas, servicios y amenidades.', badge: '☀️ Tarde' },
      noche: { title: '¡Buenas noches! Tu guía nocturna en AIFA', subtitle: 'Navega fácilmente por el aeropuerto a cualquier hora.', badge: '🌙 Noche' }
    },
    origin: 'Punto de inicio (QR Escaneado)',
    explore: 'Explora AIFA',
    swipe: 'Desliza para ver más →',
    destination: '¿A dónde quieres ir?',
    search: 'Buscar destino (ej. Puerta 105, Baños)...',
    categories: ['Todas', 'Puertas', 'Servicios', 'Comida', 'Turismo'],
    museum: { name: 'Museo del Mamut', description: 'Una parada inolvidable antes de tu vuelo.', badge: 'Historia' },
    discover: 'Descubre',
    searchLabel: 'Buscar destino',
    clearSearch: 'Limpiar búsqueda',
    locationCategories: { puertas: 'Puerta', servicios: 'Servicio', comida: 'Comida', turismo: 'Turismo' },
    locations: {
      'entrada-principal': { name: 'Entrada Principal - Acceso A', level: 'Nivel 1', zone: 'Zona Principal' },
      'filtro-seguridad': { name: 'Filtro de Seguridad Central', level: 'Nivel 2', zone: 'Zona Centro' },
      'puerta-105': { name: 'Puerta de Abordaje 105', level: 'Nivel 2', zone: 'Zona Norte' },
      'puerta-108': { name: 'Puerta de Abordaje 108', level: 'Nivel 2', zone: 'Zona Sur' },
      'banos-lucha-libre': { name: 'Sanitarios Temáticos (Lucha Libre)', level: 'Nivel 2', zone: 'Zona Norte' },
      'sala-vip': { name: 'Sala VIP Centurion', level: 'Nivel 2', zone: 'Zona Centro' }
    },
    actionGo: 'Ir →',
    noCategoryResults: 'No hay destinos en esta categoría.',
    noSearchResults: (term: string) => `No se encontraron destinos que coincidan con '${term}'.`,
    changeDestination: '← Cambiar destino',
    routeTo: 'Ruta a:',
    estimatedTime: 'Tiempo estimado:',
    walkingMinutes: (minutes: number) => `${minutes} min a pie`,
    routeBuilding: 'Ruta en construcción para este destino.',
    routeSuggestions: 'Selecciona Puerta 105 (desde Entrada Principal) o Baños Lucha Libre (desde Filtro de Seguridad) para probar la guía.',
    routeSteps: {
      'entrada-principal-puerta-105': ['Ingresa por los detectores del Acceso A.', 'Toma las escaleras eléctricas hacia el Nivel 2.', 'Pasa por el Filtro de Seguridad Central.', 'Gira a la izquierda en el pasillo principal hacia la Zona Norte.', 'Camina 150 metros. La Puerta 105 estará a tu derecha.'],
      'filtro-seguridad-banos-lucha-libre': ['Camina hacia el pasillo de la Zona Norte.', 'Los sanitarios temáticos están a 50 metros a la izquierda.']
    },
    attractions: {
      museo: { name: 'Museo del Mamut', description: 'Una parada inolvidable antes de tu vuelo.', badge: 'Historia', label: 'Atracción Cultural · Photo Spot Imperdible', schedule: 'Abierto todos los días · 09:00 - 17:00' },
      torre: { name: 'Torre de Control', description: 'Descubre el corazón operativo del aeropuerto.', badge: 'Vistas' },
      banos: { name: 'Baños Temáticos', description: 'Servicios únicos para hacer más cómodo tu viaje.', badge: 'Experiencia' }
    },
    quickActions: { bathrooms: 'Baños', food: 'Comida', search: 'Buscar', label: 'Acciones rápidas' },
    languageNames: { ES: 'Español', EN: 'Inglés', FR: 'Francés', ZH: 'Chino' },
    actionDetails: 'Ver detalles',
    voice: { buttonLabel: 'Asistente de voz', listening: 'Escuchando...', unsupported: 'El reconocimiento de voz no está disponible en este navegador.', noMatch: 'No encontré ese lugar. Prueba con el nombre, la zona o una pregunta rápida.', responsePrefix: 'Te recomiendo', quickTipPrefix: 'Aviso' },
    quickTips: {
      title: 'Preguntas rápidas',
      answerLabel: 'Respuesta',
      walkingLabel: 'Tiempo estimado',
      notice: 'Aviso: los baños de mujeres están en el Nivel 1, cerca de la zona comercial.',
      questions: {
        bathrooms: '¿Dónde están los baños de mujeres?',
        food: '¿Dónde comer algo rápido?',
        museum: '¿Cómo llegar al Museo del Mamut?',
        security: '¿Dónde están los filtros de seguridad?'
      },
      answers: {
        bathrooms: 'Dirígete a los baños de mujeres de la zona de servicios.',
        food: 'La Plaza Mexicana concentra opciones rápidas de comida y servicios.',
        museum: 'El Museo del Mamut está en la zona cultural de la terminal.',
        security: 'El Filtro de Seguridad Central es el punto de inicio del flujo de pasajeros.'
      }
    }
  },
  EN: {
    hero: {
      manana: { title: 'Good morning! Welcome to AIFA', subtitle: 'Explore the terminal in the morning light.', badge: '🌅 Morning' },
      tarde: { title: 'Good afternoon! Explore your terminal', subtitle: 'Find your gates, services, and amenities.', badge: '☀️ Afternoon' },
      noche: { title: 'Good evening! Your night guide to AIFA', subtitle: 'Navigate the airport easily at any hour.', badge: '🌙 Night' }
    },
    origin: 'Starting point (QR Scanned)',
    explore: 'Explore AIFA',
    swipe: 'Swipe to see more →',
    destination: 'Where do you want to go?',
    search: 'Search destination (e.g. Gate 105, Restrooms)...',
    categories: ['All', 'Gates', 'Services', 'Food', 'Tourism'],
    museum: { name: 'Mammoth Museum', description: 'An unforgettable stop before your flight.', badge: 'History' },
    discover: 'Discover', searchLabel: 'Search destination', clearSearch: 'Clear search',
    locationCategories: { puertas: 'Gate', servicios: 'Service', comida: 'Food', turismo: 'Tourism' },
    locations: {
      'entrada-principal': { name: 'Main Entrance - Access A', level: 'Level 1', zone: 'Main Zone' },
      'filtro-seguridad': { name: 'Central Security Checkpoint', level: 'Level 2', zone: 'Central Zone' },
      'puerta-105': { name: 'Boarding Gate 105', level: 'Level 2', zone: 'North Zone' },
      'puerta-108': { name: 'Boarding Gate 108', level: 'Level 2', zone: 'South Zone' },
      'banos-lucha-libre': { name: 'Themed Restrooms (Lucha Libre)', level: 'Level 2', zone: 'North Zone' },
      'sala-vip': { name: 'Centurion VIP Lounge', level: 'Level 2', zone: 'Central Zone' }
    },
    actionGo: 'Go →', noCategoryResults: 'No destinations in this category.', noSearchResults: (term: string) => `No destinations match '${term}'.`,
    changeDestination: '← Change destination', routeTo: 'Route to:', estimatedTime: 'Estimated time:', walkingMinutes: (minutes: number) => `${minutes} min walk`,
    routeBuilding: 'Route under construction for this destination.', routeSuggestions: 'Select Gate 105 (from Main Entrance) or Lucha Libre Restrooms (from Security Checkpoint) to try the guide.',
    routeSteps: {
      'entrada-principal-puerta-105': ['Enter through the Access A detectors.', 'Take the escalators to Level 2.', 'Go through the Central Security Checkpoint.', 'Turn left in the main hallway toward the North Zone.', 'Walk 150 meters. Gate 105 will be on your right.'],
      'filtro-seguridad-banos-lucha-libre': ['Walk toward the North Zone hallway.', 'The themed restrooms are 50 meters to the left.']
    },
    attractions: {
      museo: { name: 'Mammoth Museum', description: 'An unforgettable stop before your flight.', badge: 'History', label: 'Cultural Attraction · Must-See Photo Spot', schedule: 'Open daily · 09:00 - 17:00' },
      torre: { name: 'Control Tower', description: 'Discover the operational heart of the airport.', badge: 'Views' },
      banos: { name: 'Themed Restrooms', description: 'Unique services for a more comfortable journey.', badge: 'Experience' }
    },
    quickActions: { bathrooms: 'Restrooms', food: 'Food', search: 'Search', label: 'Quick actions' },
    languageNames: { ES: 'Spanish', EN: 'English', FR: 'French', ZH: 'Chinese' },
    actionDetails: 'View details',
    voice: { buttonLabel: 'Voice assistant', listening: 'Listening...', unsupported: 'Voice recognition is not available in this browser.', noMatch: 'I could not find that place. Try its name, zone, or a quick question.', responsePrefix: 'I recommend', quickTipPrefix: 'Notice' },
    quickTips: {
      title: 'Quick questions',
      answerLabel: 'Answer',
      walkingLabel: 'Estimated walking time',
      notice: 'Notice: the women’s restrooms are on Level 1, near the shopping zone.',
      questions: {
        bathrooms: 'Where are the women’s restrooms?',
        food: 'Where can I grab a quick bite?',
        museum: 'How do I get to the Mammoth Museum?',
        security: 'Where are the security checkpoints?'
      },
      answers: {
        bathrooms: 'Head to the women’s restrooms in the services area.',
        food: 'Mexican Plaza brings together quick food and service options.',
        museum: 'The Mammoth Museum is in the terminal’s cultural area.',
        security: 'The Central Security Checkpoint is the starting point for passenger flow.'
      }
    }
  },
  FR: {
    hero: {
      manana: { title: 'Bonjour ! Bienvenue à l’AIFA', subtitle: 'Explorez le terminal dans la lumière du matin.', badge: '🌅 Matin' },
      tarde: { title: 'Bon après-midi ! Explorez votre terminal', subtitle: 'Trouvez vos portes, services et commodités.', badge: '☀️ Après-midi' },
      noche: { title: 'Bonsoir ! Votre guide nocturne à l’AIFA', subtitle: 'Naviguez facilement dans l’aéroport à toute heure.', badge: '🌙 Nuit' }
    },
    origin: 'Point de départ (QR scanné)',
    explore: 'Explorez l’AIFA',
    swipe: 'Faites glisser pour voir plus →',
    destination: 'Où souhaitez-vous aller ?',
    search: 'Rechercher une destination (ex. Porte 105, Toilettes)...',
    categories: ['Toutes', 'Portes', 'Services', 'Restauration', 'Tourisme'],
    museum: { name: 'Musée du Mammouth', description: 'Une halte inoubliable avant votre vol.', badge: 'Histoire' },
    discover: 'Découvrez', searchLabel: 'Rechercher une destination', clearSearch: 'Effacer la recherche',
    locationCategories: { puertas: 'Porte', servicios: 'Service', comida: 'Restauration', turismo: 'Tourisme' },
    locations: {
      'entrada-principal': { name: 'Entrée principale - Accès A', level: 'Niveau 1', zone: 'Zone principale' },
      'filtro-seguridad': { name: 'Contrôle de sécurité central', level: 'Niveau 2', zone: 'Zone centrale' },
      'puerta-105': { name: 'Porte d’embarquement 105', level: 'Niveau 2', zone: 'Zone nord' },
      'puerta-108': { name: 'Porte d’embarquement 108', level: 'Niveau 2', zone: 'Zone sud' },
      'banos-lucha-libre': { name: 'Toilettes thématiques (Lucha Libre)', level: 'Niveau 2', zone: 'Zone nord' },
      'sala-vip': { name: 'Salon VIP Centurion', level: 'Niveau 2', zone: 'Zone centrale' }
    },
    actionGo: 'Aller →', noCategoryResults: 'Aucune destination dans cette catégorie.', noSearchResults: (term: string) => `Aucune destination ne correspond à « ${term} » .`,
    changeDestination: '← Changer de destination', routeTo: 'Itinéraire vers :', estimatedTime: 'Temps estimé :', walkingMinutes: (minutes: number) => `${minutes} min à pied`,
    routeBuilding: 'Itinéraire en cours de construction pour cette destination.', routeSuggestions: 'Sélectionnez la porte 105 (depuis l’entrée principale) ou les toilettes Lucha Libre (depuis le contrôle de sécurité) pour tester le guide.',
    routeSteps: {
      'entrada-principal-puerta-105': ['Entrez par les détecteurs de l’accès A.', 'Prenez les escalators vers le niveau 2.', 'Passez le contrôle de sécurité central.', 'Tournez à gauche dans le couloir principal vers la zone nord.', 'Marchez 150 mètres. La porte 105 sera sur votre droite.'],
      'filtro-seguridad-banos-lucha-libre': ['Marchez vers le couloir de la zone nord.', 'Les toilettes thématiques sont à 50 mètres sur la gauche.']
    },
    attractions: {
      museo: { name: 'Musée du Mammouth', description: 'Une halte inoubliable avant votre vol.', badge: 'Histoire', label: 'Attraction culturelle · Photo incontournable', schedule: 'Ouvert tous les jours · 09:00 - 17:00' },
      torre: { name: 'Tour de contrôle', description: 'Découvrez le cœur opérationnel de l’aéroport.', badge: 'Vues' },
      banos: { name: 'Toilettes thématiques', description: 'Des services uniques pour un voyage plus confortable.', badge: 'Expérience' }
    },
    quickActions: { bathrooms: 'Toilettes', food: 'Restauration', search: 'Rechercher', label: 'Actions rapides' },
    languageNames: { ES: 'Espagnol', EN: 'Anglais', FR: 'Français', ZH: 'Chinois' },
    actionDetails: 'Voir les détails',
    voice: { buttonLabel: 'Assistant vocal', listening: 'Écoute...', unsupported: 'La reconnaissance vocale n’est pas disponible dans ce navigateur.', noMatch: 'Je n’ai pas trouvé ce lieu. Essayez son nom, sa zone ou une question rapide.', responsePrefix: 'Je vous recommande', quickTipPrefix: 'À noter' },
    quickTips: {
      title: 'Questions rapides',
      answerLabel: 'Réponse',
      walkingLabel: 'Temps de marche estimé',
      notice: 'À noter : les toilettes pour femmes sont au niveau 1, près de la zone commerciale.',
      questions: {
        bathrooms: 'Où sont les toilettes pour femmes ?',
        food: 'Où manger rapidement ?',
        museum: 'Comment aller au Musée du Mammouth ?',
        security: 'Où sont les contrôles de sécurité ?'
      },
      answers: {
        bathrooms: 'Dirigez-vous vers les toilettes pour femmes dans la zone des services.',
        food: 'La Plaza Mexicana regroupe des options de restauration rapide et des services.',
        museum: 'Le Musée du Mammouth se trouve dans la zone culturelle du terminal.',
        security: 'Le contrôle de sécurité central est le point de départ du parcours des passagers.'
      }
    }
  },
  ZH: {
    hero: {
      manana: { title: '早上好！欢迎来到 AIFA', subtitle: '在晨光中探索航站楼。', badge: '🌅 早晨' },
      tarde: { title: '下午好！探索您的航站楼', subtitle: '查找登机口、服务和设施。', badge: '☀️ 下午' },
      noche: { title: '晚上好！您的 AIFA 夜间指南', subtitle: '随时轻松探索机场。', badge: '🌙 夜晚' }
    },
    origin: '起点（已扫描二维码）',
    explore: '探索 AIFA',
    swipe: '滑动查看更多 →',
    destination: '您想去哪里？',
    search: '搜索目的地（例如：105号登机口、洗手间）...',
    categories: ['全部', '登机口', '服务', '餐饮', '旅游'],
    museum: { name: '猛犸象博物馆', description: '飞行前不可错过的精彩一站。', badge: '历史' },
    discover: '探索', searchLabel: '搜索目的地', clearSearch: '清除搜索',
    locationCategories: { puertas: '登机口', servicios: '服务', comida: '餐饮', turismo: '旅游' },
    locations: {
      'entrada-principal': { name: '主入口 - A 入口', level: '1层', zone: '主区域' },
      'filtro-seguridad': { name: '中央安检处', level: '2层', zone: '中央区域' },
      'puerta-105': { name: '105号登机口', level: '2层', zone: '北区' },
      'puerta-108': { name: '108号登机口', level: '2层', zone: '南区' },
      'banos-lucha-libre': { name: '主题洗手间（自由摔跤）', level: '2层', zone: '北区' },
      'sala-vip': { name: 'Centurion 贵宾休息室', level: '2层', zone: '中央区域' }
    },
    actionGo: '前往 →', noCategoryResults: '此类别中没有目的地。', noSearchResults: (term: string) => `没有找到与“${term}”匹配的目的地。`,
    changeDestination: '← 更换目的地', routeTo: '前往：', estimatedTime: '预计时间：', walkingMinutes: (minutes: number) => `步行 ${minutes} 分钟`,
    routeBuilding: '该目的地的路线正在建设中。', routeSuggestions: '请选择105号登机口（从主入口出发）或自由摔跤洗手间（从中央安检处出发）来试用指南。',
    routeSteps: {
      'entrada-principal-puerta-105': ['从 A 入口通过安检门。', '乘自动扶梯前往2层。', '通过中央安检处。', '在主走廊向左转，前往北区。', '步行150米，105号登机口就在右侧。'],
      'filtro-seguridad-banos-lucha-libre': ['沿北区走廊前行。', '主题洗手间在左侧50米处。']
    },
    attractions: {
      museo: { name: '猛犸象博物馆', description: '飞行前不可错过的精彩一站。', badge: '历史', label: '文化景点 · 必拍照片打卡地', schedule: '每日开放 · 09:00 - 17:00' },
      torre: { name: '控制塔', description: '探索机场的运营中心。', badge: '景观' },
      banos: { name: '主题洗手间', description: '让旅程更加舒适的独特服务。', badge: '体验' }
    },
    quickActions: { bathrooms: '洗手间', food: '餐饮', search: '搜索', label: '快捷操作' },
    languageNames: { ES: '西班牙语', EN: '英语', FR: '法语', ZH: '中文' },
    actionDetails: '查看详情',
    voice: { buttonLabel: '语音助手', listening: '正在聆听...', unsupported: '此浏览器不支持语音识别。', noMatch: '没有找到这个地点。请尝试说出名称、区域或快速问题。', responsePrefix: '推荐地点', quickTipPrefix: '提示' },
    quickTips: {
      title: '快速问答',
      answerLabel: '回答',
      walkingLabel: '预计步行时间',
      notice: '提示：女洗手间位于1层，靠近商业区。',
      questions: {
        bathrooms: '女洗手间在哪里？',
        food: '在哪里可以快速用餐？',
        museum: '如何前往猛犸象博物馆？',
        security: '安检处在哪里？'
      },
      answers: {
        bathrooms: '请前往服务区的女洗手间。',
        food: '墨西哥广场汇集了快速餐饮和服务选项。',
        museum: '猛犸象博物馆位于航站楼文化区。',
        security: '中央安检处是旅客流程的起点。'
      }
    }
  }
} satisfies Record<Language, unknown>;

const ATTRACTIONS: Attraction[] = [
  {
    key: 'museo',
    image: '/images/museo-mamut.jpg',
    searchTerm: 'mamut'
  },
  {
    key: 'torre',
    image: '/images/hero-tarde.jpg',
    searchTerm: 'torre'
  },
  {
    key: 'banos',
    image: '/images/hero-noche.jpg',
    searchTerm: 'baños'
  }
];

function getHeroPeriod(hour: number): HeroPeriod {
  if (hour >= 6 && hour < 12) return 'manana';
  if (hour >= 12 && hour < 19) return 'tarde';
  return 'noche';
}

function normalizeVoiceText(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function NavigationContent() {
  const searchParams = useSearchParams();
  const origenParam = searchParams.get('origen') || 'entrada-principal';

  const [heroIndex, setHeroIndex] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>('ES');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeQuickTip, setActiveQuickTip] = useState<QuickTipKey | null>(null);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [voiceDestinationId, setVoiceDestinationId] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const initialPeriod = getHeroPeriod(new Date().getHours());
    setHeroIndex(HERO_PERIODS.indexOf(initialPeriod));

    const intervalId = window.setInterval(() => {
      setHeroIndex((currentIndex) => (currentIndex === null ? 0 : (currentIndex + 1) % HERO_SLIDES.length));
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const updateClock = () => setCurrentTime(new Date());
    updateClock();
    const intervalId = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const currentOrigin = MOCK_LOCATIONS[origenParam] || MOCK_LOCATIONS['entrada-principal'];
  const copy = translations[currentLang];
  const availableDestinations = Object.values(MOCK_LOCATIONS).filter(
    (loc) => loc.id !== currentOrigin.id
  );

  const filteredDestinations = availableDestinations.filter((loc) => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const localizedLocation = loc.translations[currentLang];
    const matchesSearch =
      !normalizedSearchTerm ||
      localizedLocation.title.toLowerCase().includes(normalizedSearchTerm) ||
      localizedLocation.description.toLowerCase().includes(normalizedSearchTerm) ||
      loc.mapZone.toLowerCase().includes(normalizedSearchTerm);
    const matchesCategory = selectedCategory === 'todas' || loc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const routeKey = `${currentOrigin.id}-${selectedDestination}`;
  const currentRoute = selectedDestination ? MOCK_ROUTES[routeKey] : null;
  const hero = heroIndex === null
    ? null
    : { ...HERO_SLIDES[heroIndex], ...copy.hero[HERO_PERIODS[heroIndex]] };
  const selectedLanguage = LANGUAGE_OPTIONS.find((option) => option.code === currentLang) || LANGUAGE_OPTIONS[0];
  const activeQuickTipDestination = activeQuickTip
    ? MOCK_LOCATIONS[QUICK_TIP_DESTINATIONS[activeQuickTip].id]
    : null;
  const voiceDestination = voiceDestinationId ? MOCK_LOCATIONS[voiceDestinationId] : null;

  const categories = [
    { id: 'todas', label: copy.categories[0] },
    { id: 'puertas', label: copy.categories[1] },
    { id: 'servicios', label: copy.categories[2] },
    { id: 'comida', label: copy.categories[3] },
    { id: 'turismo', label: copy.categories[4] }
  ];

  const speakDestination = (locationId: string) => {
    const location = MOCK_LOCATIONS[locationId];
    if (!location) return;

    const localizedLocation = location.translations[currentLang];
    const alert = location.quickTip?.[currentLang];
    const response = `${copy.voice.responsePrefix} ${localizedLocation.title}, ${location.mapZone}, ${location.walkTime}. ${localizedLocation.description}${alert ? ` ${copy.voice.quickTipPrefix}: ${alert}` : ''}`;
    setVoiceDestinationId(locationId);
    setSelectedDestination(null);
    setVoiceMessage(response);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = SPEECH_SYNTHESIS_LOCALES[currentLang];
    window.speechSynthesis.speak(utterance);
  };

  const findVoiceDestination = (transcript: string): { id: string; quickTipKey?: QuickTipKey } | null => {
    const normalizedTranscript = normalizeVoiceText(transcript);
    const quickTipMatch = (Object.keys(copy.quickTips.questions) as QuickTipKey[]).find((tipKey) => {
      const questionWords = normalizeVoiceText(copy.quickTips.questions[tipKey])
        .split(/\s+/)
        .filter((word) => word.length > 3 && !['donde', 'where', 'sont', 'sind', 'esta', 'estan', 'como', 'comment', 'where', 'están'].includes(word));
      return questionWords.filter((word) => normalizedTranscript.includes(word)).length >= 2;
    });

    if (quickTipMatch) return { id: QUICK_TIP_DESTINATIONS[quickTipMatch].id, quickTipKey: quickTipMatch };

    let bestMatch: { id: string; score: number } | null = null;
    for (const location of Object.values(MOCK_LOCATIONS)) {
      const localizedLocation = location.translations[currentLang];
      const searchableText = [
        localizedLocation.title,
        localizedLocation.description,
        location.mapZone,
        copy.locationCategories[location.category]
      ];
      const score = searchableText
        .flatMap((value) => normalizeVoiceText(value).split(/\s+/))
        .filter((word) => word.length > 2 && normalizedTranscript.includes(word)).length;
      if (score > (bestMatch?.score || 0)) bestMatch = { id: location.id, score };
    }

    const resolvedMatch = bestMatch as { id: string; score: number } | null;
    return resolvedMatch && resolvedMatch.score > 0 ? { id: resolvedMatch.id } : null;
  };

  const startVoiceAssistant = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceMessage(copy.voice.unsupported);
      return;
    }

    if (isVoiceListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new Recognition();
    recognition.lang = selectedLanguage.locale;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => {
      setIsVoiceListening(true);
      setVoiceMessage(copy.voice.listening);
    };
    recognition.onend = () => setIsVoiceListening(false);
    recognition.onerror = () => {
      setIsVoiceListening(false);
      setVoiceMessage(copy.voice.noMatch);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const match = findVoiceDestination(transcript);
      if (!match) {
        setVoiceMessage(copy.voice.noMatch);
        return;
      }
      setActiveQuickTip(match.quickTipKey || null);
      speakDestination(match.id);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  useEffect(() => () => {
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 p-0 text-slate-100 sm:p-4">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col overflow-hidden bg-white text-slate-900 shadow-xl sm:min-h-[calc(100vh-2rem)] sm:rounded-3xl">
        <section
          key={hero?.title}
          className="relative min-h-72 overflow-hidden bg-slate-700 text-white animate-[fade-in_700ms_ease-out] sm:min-h-80"
          style={
            hero
              ? {
                  backgroundImage: `url("${hero.image}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }
              : undefined
          }
          aria-label={hero?.title || copy.hero.noche.title}
        >
          <div className="absolute inset-0 bg-slate-900/60" />
          <div className="relative flex min-h-72 flex-col justify-end p-5 sm:min-h-80 sm:p-8">
            <div className="absolute right-5 top-5 flex items-start gap-2 sm:right-8 sm:top-8">
              <time className="rounded-lg bg-slate-950/45 px-3 py-2 text-sm font-bold tabular-nums text-white backdrop-blur-sm">
                {currentTime
                  ? currentTime.toLocaleString(selectedLanguage.locale, { dateStyle: 'short', timeStyle: 'short' })
                  : '--:--'}
              </time>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLanguageMenuOpen((isOpen) => !isOpen)}
                  aria-expanded={isLanguageMenuOpen}
                  aria-haspopup="listbox"
                  aria-label={copy.languageNames[currentLang]}
                  className="rounded-lg bg-slate-950/45 px-3 py-2 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-slate-950/65"
                >
                  {selectedLanguage.flag} {currentLang}
                </button>
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 top-11 z-30 min-w-36 overflow-hidden rounded-xl border border-white/20 bg-slate-950/95 p-1 text-sm shadow-xl backdrop-blur-md" role="listbox">
                    {LANGUAGE_OPTIONS.map((option) => (
                      <button
                        key={option.code}
                        type="button"
                        role="option"
                        aria-selected={currentLang === option.code}
                        onClick={() => {
                          setCurrentLang(option.code);
                          setIsLanguageMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-white transition hover:bg-white/15"
                      >
                        <span>{option.flag}</span>
                        <span>{copy.languageNames[option.code]}</span>
                        <span className="ml-auto text-xs text-slate-400">{option.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={startVoiceAssistant}
                aria-label={isVoiceListening ? copy.voice.listening : copy.voice.buttonLabel}
                aria-pressed={isVoiceListening}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg text-white backdrop-blur-sm transition ${
                  isVoiceListening
                    ? 'bg-red-500 shadow-lg shadow-red-500/40 animate-pulse'
                    : 'bg-slate-950/45 hover:bg-slate-950/65'
                }`}
              >
                <span aria-hidden="true">{isVoiceListening ? '●' : '🎙'}</span>
              </button>
            </div>
            {hero ? (
              <>
                <span className="mb-3 self-start rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  {hero.badge}
                </span>
                <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">{hero.title}</h1>
                <p className="mt-2 max-w-sm text-sm text-slate-200 sm:text-base">{hero.subtitle}</p>
              </>
            ) : (
              <div className="h-24 animate-pulse rounded-lg bg-white/10" />
            )}
          </div>
        </section>

        {/* Encabezado: Ubicación actual */}
        <header className="bg-blue-600 p-5 text-white shadow-md sm:px-8">
          <p className="text-xs uppercase tracking-wider font-semibold opacity-80">{copy.origin}</p>
          <h1 className="text-xl font-bold mt-1">{currentOrigin.translations[currentLang].title}</h1>
          <p className="text-xs opacity-90 mt-1">
            {currentOrigin.mapZone} • {currentOrigin.walkTime}
          </p>
        </header>

        {/* Contenido principal */}
        <div className="flex-1 p-5 pb-24 sm:p-8 sm:pb-8">
          {!selectedDestination ? (
            <>
              <section className="mb-8">
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{copy.discover}</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-800">{copy.explore}</h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{copy.swipe}</span>
                </div>
                <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 scrollbar-none sm:-mx-8 sm:px-8">
                  {ATTRACTIONS.map((attraction) => (
                    <button
                      key={attraction.key}
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory(attraction.key === 'banos' ? 'servicios' : 'todas');
                      }}
                      className="group relative min-w-[84%] snap-start overflow-hidden rounded-2xl text-left shadow-lg transition-transform duration-300 hover:-translate-y-1 sm:min-w-[42%] lg:min-w-[32%]"
                    >
                      <div
                        className="h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url("${attraction.image}")` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md animate-[float_4s_ease-in-out_infinite] transition-transform duration-300 group-hover:scale-105">
                        {copy.attractions[attraction.key].badge}
                      </span>
                      <div className="absolute inset-x-4 bottom-4 text-white">
                        <h3 className="text-lg font-bold">
                          {copy.attractions[attraction.key].name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-200">
                          {copy.attractions[attraction.key].description}
                        </p>
                        {copy.attractions[attraction.key].label && (
                          <span className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-wide text-blue-200">
                            {copy.attractions[attraction.key].label}
                          </span>
                        )}
                        {copy.attractions[attraction.key].schedule && (
                          <span className="mt-1 block text-[10px] text-slate-300">
                            {copy.attractions[attraction.key].schedule}
                          </span>
                        )}
                        <span className="mt-2 block text-xs font-bold text-white underline underline-offset-2">
                          {copy.actionDetails}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <h2 className="mb-3 text-lg font-bold text-slate-800">{copy.destination}</h2>

              {/* Búsqueda de destinos */}
              <div className="relative mb-4">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={copy.search}
                  id="destination-search"
                  aria-label={copy.searchLabel}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-11 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label={copy.clearSearch}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                )}
              </div>

              <section className="mb-6" aria-labelledby="quick-tips-title">
                <h3 id="quick-tips-title" className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                  {copy.quickTips.title}
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {(Object.keys(copy.quickTips.questions) as QuickTipKey[]).map((tipKey) => (
                    <button
                      key={tipKey}
                      type="button"
                      onClick={() => setActiveQuickTip(tipKey)}
                      className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                        activeQuickTip === tipKey
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {copy.quickTips.questions[tipKey]}
                    </button>
                  ))}
                </div>
                {activeQuickTip && activeQuickTipDestination && (
                  <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950" role="status">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{copy.quickTips.answerLabel}</p>
                    <p className="mt-1 font-semibold">{copy.quickTips.answers[activeQuickTip]}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-white px-2.5 py-1 text-blue-800">
                        {copy.quickTips.walkingLabel}: {copy.walkingMinutes(QUICK_TIP_DESTINATIONS[activeQuickTip].minutes)}
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-blue-800">
                        {activeQuickTipDestination.translations[currentLang].title}
                      </span>
                    </div>
                    {activeQuickTip === 'bathrooms' && (
                      <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                        {activeQuickTipDestination.quickTip?.[currentLang] || copy.quickTips.notice}
                      </p>
                    )}
                  </div>
                )}
                {voiceDestination && (
                  <article className="mt-3 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-950 shadow-sm" aria-live="polite">
                    <div className="flex items-start gap-3 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg text-white" aria-hidden="true">🎙</div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{copy.voice.buttonLabel}</p>
                        <h3 className="mt-1 font-bold">{voiceDestination.translations[currentLang].title}</h3>
                        <p className="mt-1 text-sm">{voiceDestination.translations[currentLang].description}</p>
                        <p className="mt-2 text-xs font-semibold">
                          {voiceDestination.mapZone} • {voiceDestination.walkTime}
                        </p>
                        {voiceDestination.quickTip?.[currentLang] && (
                          <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                            {voiceDestination.quickTip[currentLang]}
                          </p>
                        )}
                        {voiceMessage && <p className="mt-2 text-xs italic text-emerald-800">{voiceMessage}</p>}
                      </div>
                    </div>
                  </article>
                )}
              </section>

              {/* Botones de Filtro por Categoría */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Lista filtrada de destinos */}
              <div
                key={`${selectedCategory}-${searchTerm}`}
                className="space-y-3 animate-[fade-in_350ms_ease-out]"
              >
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((loc) => (
                    <div
                      key={loc.id}
                      className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition flex justify-between items-center group"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-800 group-hover:text-blue-600">{loc.translations[currentLang].title}</h3>
                        <p className="mt-0.5 text-xs text-slate-500">{loc.translations[currentLang].description}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {copy.locationCategories[loc.category]} • {loc.mapZone} • {loc.walkTime}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedDestination(loc.id)}
                          className="text-blue-600 font-bold text-sm"
                        >
                          {copy.actionDetails}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedDestination(loc.id)}
                          className="text-blue-600 font-bold text-sm"
                        >
                          {copy.actionGo}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-6">
                    {searchTerm.trim() ? copy.noSearchResults(searchTerm) : copy.noCategoryResults}
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Vista de Guía de Navegación Paso a Paso */
            <div className="flex-1 flex flex-col">
              <button
                onClick={() => setSelectedDestination(null)}
                className="text-xs text-blue-600 font-semibold mb-4 hover:underline self-start flex items-center gap-1"
              >
                {copy.changeDestination}
              </button>

              <h2 className="text-lg font-bold text-slate-800">
                {copy.routeTo} {MOCK_LOCATIONS[selectedDestination]?.translations[currentLang].title}
              </h2>

              {currentRoute ? (
                <div className="mt-4 flex-1">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-xs text-blue-800 flex justify-between items-center font-medium">
                    <span>{copy.estimatedTime}</span>
                    <span className="font-bold">{copy.walkingMinutes(currentRoute.estimatedMinutes)}</span>
                  </div>

                  <div className="space-y-4">
                    {(copy.routeSteps[routeKey] || []).map((instruction, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <p className="text-sm text-slate-700">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  {copy.routeBuilding} {copy.routeSuggestions}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <nav className="fixed inset-x-4 bottom-4 z-20 mx-auto flex max-w-md items-center justify-around rounded-2xl border border-white/10 bg-slate-950/90 p-2 shadow-2xl backdrop-blur-lg sm:hidden" aria-label={copy.quickActions.label}>
        <button
          type="button"
          onClick={() => { setSelectedDestination(null); setSearchTerm(''); setSelectedCategory('servicios'); }}
          className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <span className="text-xl transition-transform duration-300 hover:scale-125">🚽</span>
          {copy.quickActions.bathrooms}
        </button>
        <button
          type="button"
          onClick={() => { setSelectedDestination(null); setSelectedCategory('comida'); setSearchTerm(''); }}
          className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <span className="text-xl transition-transform duration-300 hover:scale-125">🍔</span>
          {copy.quickActions.food}
        </button>
        <button
          type="button"
          onClick={() => { setSelectedDestination(null); setSelectedCategory('todas'); document.getElementById('destination-search')?.focus(); }}
          className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <span className="text-xl transition-transform duration-300 hover:scale-125">🔍</span>
          {copy.quickActions.search}
        </button>
      </nav>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-4 text-center" aria-busy="true" />}>
      <NavigationContent />
    </Suspense>
  );
}