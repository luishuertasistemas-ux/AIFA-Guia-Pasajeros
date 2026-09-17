'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { MOCK_LOCATIONS, MOCK_ROUTES } from '../data/locations';

type HeroPeriod = 'manana' | 'tarde' | 'noche';
type Language = 'ES' | 'EN' | 'FR' | 'ZH';
type Attraction = {
  name: string;
  description: string;
  badge: string;
  image: string;
  searchTerm: string;
};

const HERO_CONFIG: Record<HeroPeriod, { image: string; title: string; subtitle: string; badge: string }> = {
  manana: {
    image: '/images/hero-manana.jpg',
    title: '¡Buenos días! Bienvenido al AIFA',
    subtitle: 'Explora la terminal bajo la luz de la mañana.',
    badge: '🌅 Mañana'
  },
  tarde: {
    image: '/images/hero-tarde.jpg',
    title: '¡Buenas tardes! Explora tu terminal',
    subtitle: 'Encuentra tus puertas, servicios y amenidades.',
    badge: '☀️ Tarde'
  },
  noche: {
    image: '/images/hero-noche.jpg',
    title: '¡Buenas noches! Tu guía nocturna en AIFA',
    subtitle: 'Navega fácilmente por el aeropuerto a cualquier hora.',
    badge: '🌙 Noche'
  }
};

const HERO_SLIDES = Object.values(HERO_CONFIG);
const HERO_PERIODS: HeroPeriod[] = ['manana', 'tarde', 'noche'];

const LANGUAGE_OPTIONS: { code: Language; label: string; flag: string; locale: string }[] = [
  { code: 'ES', label: 'Español', flag: '🇲🇽', locale: 'es-MX' },
  { code: 'EN', label: 'English', flag: '🇺🇸', locale: 'en-US' },
  { code: 'FR', label: 'Français', flag: '🇫🇷', locale: 'fr-FR' },
  { code: 'ZH', label: '中文', flag: '🇨🇳', locale: 'zh-CN' }
];

const translations = {
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
    categories: ['Todas', 'Puertas', 'Baños', 'Salas & Comida', 'Servicios'],
    museum: { name: 'Museo del Mamut', description: 'Una parada inolvidable antes de tu vuelo.', badge: 'Historia' }
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
    categories: ['All', 'Gates', 'Restrooms', 'Lounges & Food', 'Services'],
    museum: { name: 'Mammoth Museum', description: 'An unforgettable stop before your flight.', badge: 'History' }
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
    categories: ['Toutes', 'Portes', 'Toilettes', 'Salons & Restauration', 'Services'],
    museum: { name: 'Musée du Mammouth', description: 'Une halte inoubliable avant votre vol.', badge: 'Histoire' }
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
    categories: ['全部', '登机口', '洗手间', '休息室和餐饮', '服务'],
    museum: { name: '猛犸象博物馆', description: '飞行前不可错过的精彩一站。', badge: '历史' }
  }
} satisfies Record<Language, unknown>;

const ATTRACTIONS: Attraction[] = [
  {
    name: 'Museo del Mamut',
    description: 'Una parada inolvidable antes de tu vuelo.',
    badge: 'Historia',
    image: '/images/museo-mamut.jpg',
    searchTerm: 'mamut'
  },
  {
    name: 'Torre de Control',
    description: 'Descubre el corazón operativo del aeropuerto.',
    badge: 'Vistas',
    image: '/images/hero-tarde.jpg',
    searchTerm: 'torre'
  },
  {
    name: 'Baños Temáticos',
    description: 'Servicios únicos para hacer más cómodo tu viaje.',
    badge: 'Experiencia',
    image: '/images/hero-noche.jpg',
    searchTerm: 'baños'
  }
];

function getHeroPeriod(hour: number): HeroPeriod {
  if (hour >= 6 && hour < 12) return 'manana';
  if (hour >= 12 && hour < 19) return 'tarde';
  return 'noche';
}

function NavigationContent() {
  const searchParams = useSearchParams();
  const origenParam = searchParams.get('origen') || 'entrada-principal';

  const [heroIndex, setHeroIndex] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [language, setLanguage] = useState<Language>('ES');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const initialPeriod = getHeroPeriod(new Date().getHours());
    const initialIndex = HERO_SLIDES.findIndex((slide) => slide.badge === HERO_CONFIG[initialPeriod].badge);
    setHeroIndex(initialIndex >= 0 ? initialIndex : 0);

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
  const availableDestinations = Object.values(MOCK_LOCATIONS).filter(
    (loc) => loc.id !== currentOrigin.id
  );

  const filteredDestinations = availableDestinations.filter((loc) => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearchTerm ||
      loc.name.toLowerCase().includes(normalizedSearchTerm) ||
      loc.zone.toLowerCase().includes(normalizedSearchTerm);
    const matchesCategory = selectedCategory === 'todas' || loc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const routeKey = `${currentOrigin.id}-${selectedDestination}`;
  const currentRoute = selectedDestination ? MOCK_ROUTES[routeKey] : null;
  const copy = translations[language];
  const hero = heroIndex === null
    ? null
    : { ...HERO_SLIDES[heroIndex], ...copy.hero[HERO_PERIODS[heroIndex]] };
  const selectedLanguage = LANGUAGE_OPTIONS.find((option) => option.code === language) || LANGUAGE_OPTIONS[0];

  const categories = [
    { id: 'todas', label: copy.categories[0] },
    { id: 'puerta', label: copy.categories[1] },
    { id: 'bano', label: copy.categories[2] },
    { id: 'restaurante', label: copy.categories[3] },
    { id: 'servicio', label: copy.categories[4] }
  ];

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
          aria-label={hero?.title || 'Cargando bienvenida'}
        >
          <div className="absolute inset-0 bg-slate-900/60" />
          <div className="relative flex min-h-72 flex-col justify-end p-5 sm:min-h-80 sm:p-8">
            <div className="absolute right-5 top-5 flex items-start gap-2 sm:right-8 sm:top-8">
              <time className="rounded-lg bg-slate-950/45 px-3 py-2 text-sm font-bold tabular-nums text-white backdrop-blur-sm">
                {currentTime
                  ? currentTime.toLocaleTimeString(selectedLanguage.locale, { hour: '2-digit', minute: '2-digit', hour12: true })
                  : '--:--'}
              </time>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLanguageMenuOpen((isOpen) => !isOpen)}
                  aria-expanded={isLanguageMenuOpen}
                  aria-haspopup="listbox"
                  aria-label="Seleccionar idioma"
                  className="rounded-lg bg-slate-950/45 px-3 py-2 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-slate-950/65"
                >
                  {selectedLanguage.flag} {language}
                </button>
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 top-11 z-30 min-w-36 overflow-hidden rounded-xl border border-white/20 bg-slate-950/95 p-1 text-sm shadow-xl backdrop-blur-md" role="listbox">
                    {LANGUAGE_OPTIONS.map((option) => (
                      <button
                        key={option.code}
                        type="button"
                        role="option"
                        aria-selected={language === option.code}
                        onClick={() => {
                          setLanguage(option.code);
                          setIsLanguageMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-white transition hover:bg-white/15"
                      >
                        <span>{option.flag}</span>
                        <span>{option.label}</span>
                        <span className="ml-auto text-xs text-slate-400">{option.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
          <h1 className="text-xl font-bold mt-1">{currentOrigin.name}</h1>
          <p className="text-xs opacity-90 mt-1">
            Terminal Pasajeros • {currentOrigin.level} • {currentOrigin.zone}
          </p>
        </header>

        {/* Contenido principal */}
        <div className="flex-1 p-5 pb-24 sm:p-8 sm:pb-8">
          {!selectedDestination ? (
            <>
              <section className="mb-8">
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Descubre</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-800">{copy.explore}</h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{copy.swipe}</span>
                </div>
                <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 scrollbar-none sm:-mx-8 sm:px-8">
                  {ATTRACTIONS.map((attraction) => (
                    <button
                      key={attraction.name}
                      type="button"
                      onClick={() => {
                        setSearchTerm(attraction.searchTerm);
                        setSelectedCategory('todas');
                      }}
                      className="group relative min-w-[84%] snap-start overflow-hidden rounded-2xl text-left shadow-lg transition-transform duration-300 hover:-translate-y-1 sm:min-w-[42%] lg:min-w-[32%]"
                    >
                      <div
                        className="h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url("${attraction.image}")` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md animate-[float_4s_ease-in-out_infinite] transition-transform duration-300 group-hover:scale-105">
                        {attraction.name === 'Museo del Mamut' ? copy.museum.badge : attraction.badge}
                      </span>
                      <div className="absolute inset-x-4 bottom-4 text-white">
                        <h3 className="text-lg font-bold">
                          {attraction.name === 'Museo del Mamut' ? copy.museum.name : attraction.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-200">
                          {attraction.name === 'Museo del Mamut' ? copy.museum.description : attraction.description}
                        </p>
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
                  aria-label="Buscar destino"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-11 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                  >
                    X
                  </button>
                )}
              </div>

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
                    <button
                      key={loc.id}
                      onClick={() => setSelectedDestination(loc.id)}
                      className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition flex justify-between items-center group"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-800 group-hover:text-blue-600">
                          {loc.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {loc.category.toUpperCase()} • {loc.zone}
                        </p>
                      </div>
                      <span className="text-blue-600 font-bold text-sm">Ir →</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-6">
                    {searchTerm.trim()
                      ? `No se encontraron destinos que coincidan con '${searchTerm}'.`
                      : 'No hay destinos en esta categoría.'}
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
                ← Cambiar destino
              </button>

              <h2 className="text-lg font-bold text-slate-800">
                Ruta a: {MOCK_LOCATIONS[selectedDestination]?.name}
              </h2>

              {currentRoute ? (
                <div className="mt-4 flex-1">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-xs text-blue-800 flex justify-between items-center font-medium">
                    <span>Tiempo estimado:</span>
                    <span className="font-bold">{currentRoute.estimatedMinutes} min a pie</span>
                  </div>

                  <div className="space-y-4">
                    {currentRoute.steps.map((s) => (
                      <div key={s.step} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {s.step}
                        </span>
                        <p className="text-sm text-slate-700">{s.instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  Ruta en construcción para este destino. Selecciona <strong>Puerta 105</strong> (desde Entrada Principal) o <strong>Baños Lucha Libre</strong> (desde Filtro de Seguridad) para probar la guía.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <nav className="fixed inset-x-4 bottom-4 z-20 mx-auto flex max-w-md items-center justify-around rounded-2xl border border-white/10 bg-slate-950/90 p-2 shadow-2xl backdrop-blur-lg sm:hidden" aria-label="Acciones rápidas">
        <button
          type="button"
          onClick={() => { setSelectedDestination(null); setSearchTerm('baños'); setSelectedCategory('bano'); }}
          className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <span className="text-xl transition-transform duration-300 hover:scale-125">🚽</span>
          Baños
        </button>
        <button
          type="button"
          onClick={() => { setSelectedDestination(null); setSelectedCategory('restaurante'); setSearchTerm(''); }}
          className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <span className="text-xl transition-transform duration-300 hover:scale-125">🍔</span>
          Comida
        </button>
        <button
          type="button"
          onClick={() => { setSelectedDestination(null); setSelectedCategory('todas'); document.getElementById('destination-search')?.focus(); }}
          className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <span className="text-xl transition-transform duration-300 hover:scale-125">🔍</span>
          Buscar
        </button>
      </nav>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Cargando guía...</div>}>
      <NavigationContent />
    </Suspense>
  );
}