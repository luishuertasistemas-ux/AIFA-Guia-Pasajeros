'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  Building2,
  Bus,
  Car,
  Check,
  Coffee,
  Clock3,
  ExternalLink,
  Landmark,
  Luggage,
  MapPin,
  MessageCircle,
  PawPrint,
  Plane,
  PlaneTakeoff,
  QrCode,
  ShieldCheck,
  Ticket,
  TrainFront,
  TriangleAlert,
  UsersRound,
  type LucideIcon
} from 'lucide-react';
import QrScannerModal from './QrScannerModal';
import { FlightTimeModule } from '@/components/flight-time/FlightTimeModule';
import { mexibusToDocRoute } from '@/data/mexibusToDocRoute';
import { MOCK_LOCATIONS } from '@/data/locations';
import { useClickSound } from '@/hooks/useClickSound';
import type { Location } from '@/types/location';
import {
  OPCIONES_ENCUESTA,
  RESPUESTAS_PANTALLA,
  TIA_INFO_BANNER,
  TRANSPORTE_DATA,
  TURISMO_DATA,
  type OpcionEncuesta,
  type SubModulo
} from '@/data/pasajeros';

type Screen = 'welcome' | 'hub' | 'role' | 'survey';
type RoleId = 'arrival' | 'departure' | 'pickup' | 'tourism' | 'transport' | 'lost-items' | 'pets';
type QrRoute = { role?: RoleId; locationId?: string; activateTia?: boolean };
type RoleInfo = {
  id: RoleId;
  title: string;
  subtitle: string;
  description: string;
  steps: string[];
  icon: LucideIcon;
};
type TimeTheme = { label: string; image: string };
type FallbackImageProps = {
  src: string;
  fallback: string;
  alt: string;
  sizes: string;
  className: string;
  fill?: boolean;
};

function FallbackImage({ src, fallback, alt, sizes, className, fill }: FallbackImageProps) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      onError={() => {
        if (imageSrc !== fallback) setImageSrc(fallback);
      }}
    />
  );
}

const ROLE_INFO: Record<RoleId, RoleInfo> = {
  arrival: {
    id: 'arrival',
    title: 'Llegué en un vuelo',
    subtitle: 'Equipaje, migración y salida',
    description: 'Te ayudamos a orientarte al llegar y a encontrar el siguiente paso de tu recorrido.',
    steps: ['Sigue la señalización hacia equipaje y llegadas.', 'Localiza servicios y transporte en la terminal.', 'Confirma tu punto de salida antes de continuar.'],
    icon: Plane
  },
  departure: {
    id: 'departure',
    title: 'Voy a viajar',
    subtitle: 'Check-in, filtros y salas',
    description: 'Organiza tu salida con tiempo y ubica los puntos principales antes de abordar.',
    steps: ['Consulta con tu aerolínea el mostrador de documentación.', 'Ten a la mano tus documentos para pasar los filtros.', 'Revisa las pantallas para confirmar tu sala y puerta.'],
    icon: Plane
  },
  pickup: {
    id: 'pickup',
    title: 'Vengo por alguien',
    subtitle: 'Punto de encuentro y llegadas',
    description: 'Coordina un encuentro sencillo en la zona de llegadas y mantente atento a los avisos de vuelo.',
    steps: ['Confirma la terminal y el horario de llegada.', 'Acuerda un punto de encuentro fácil de reconocer.', 'Sigue la señalización hacia el área pública de llegadas.'],
    icon: UsersRound
  },
  tourism: {
    id: 'tourism',
    title: 'Paseo y Turismo',
    subtitle: 'Museos, plaza y baños temáticos',
    description: 'Explora los espacios culturales y comerciales del aeropuerto durante tu visita.',
    steps: ['Visita el Museo del Mamut y sus espacios culturales.', 'Recorre la Plaza Mexicana y consulta sus servicios.', 'Sigue los señalamientos para ubicar los baños temáticos.'],
    icon: Landmark
  },
  transport: {
    id: 'transport',
    title: 'Transporte',
    subtitle: 'Opciones para continuar tu trayecto',
    description: 'Ubica las conexiones terrestres disponibles y confirma horarios y puntos de abordaje.',
    steps: ['Sigue la señalización oficial hacia transporte.', 'Confirma horarios, tarifas y disponibilidad con el operador.', 'Conserva tus pertenencias durante el traslado.'],
    icon: TrainFront
  },
  'lost-items': {
    id: 'lost-items',
    title: 'Objetos olvidados',
    subtitle: 'Orientación para recuperar tus pertenencias',
    description: 'Si olvidaste algo, reporta el objeto con la mayor cantidad de detalles posible.',
    steps: ['Anota dónde y cuándo viste el objeto por última vez.', 'Describe el objeto y cualquier dato que permita identificarlo.', 'Solicita orientación al personal del aeropuerto o de tu aerolínea.'],
    icon: Backpack
  },
  pets: {
    id: 'pets',
    title: 'Mascotas',
    subtitle: 'Viaja preparado con tu animal de compañía',
    description: 'Consulta con anticipación las reglas de tu aerolínea y los servicios disponibles en terminal.',
    steps: ['Confirma requisitos y transportadora directamente con tu aerolínea.', 'Lleva contigo la documentación veterinaria requerida.', 'Mantén a tu mascota bajo supervisión en las áreas permitidas.'],
    icon: PawPrint
  }
};

type MainRoleId = 'arrival' | 'departure' | 'pickup' | 'tourism';

const MAIN_ROLE_IDS: MainRoleId[] = ['arrival', 'departure', 'pickup', 'tourism'];
const SUPPORT_ROLE_IDS: RoleId[] = ['transport', 'lost-items', 'pets'];
const ARRIVAL_GUIDE_STEPS = [
  {
    title: '1. Reclamo de Equipaje y Control',
    description: 'Dirígete a las bandas de reclamo de equipaje. Si llegas en un vuelo internacional, pasa por el filtro de Migración e INM.',
    badges: ['Bandas 1-6', 'Migración INM', 'Aduana'],
    icon: Luggage
  },
  {
    title: '2. Servicios Esenciales en la Terminal',
    description: 'Encuentra cajeros automáticos, casas de cambio, sanitarios temáticos, atención médica y módulos de información a la salida.',
    badges: ['Cajeros ATM', 'Sanitarios', 'Info Turística'],
    icon: Building2
  },
  {
    title: '3. Transporte y Salida del AIFA',
    description: 'Conecta directamente con la estación del Mexibús (Línea 1), taxis autorizados, autobuses foráneos o el área de estacionamiento.',
    badges: ['Mexibús Línea 1', 'Taxis Autorizados', 'Autobuses Foráneos', 'Estacionamiento'],
    icon: Bus
  }
];
const DEPARTURE_GUIDE_STEPS = [
  {
    title: '1. Check-in y Documentación',
    description: 'Ubica los mostradores de tu aerolínea o usa los kioscos digitales para imprimir tu pase de abordar y documentar equipaje de bodega.',
    badges: ['Mostradores A-F', 'Kioscos Digitales', 'Equipaje'],
    linkLabel: 'Ver mapa de mostradores →',
    href: '/images/aifa-mapa.png',
    icon: Ticket
  },
  {
    title: '2. Filtros de Seguridad e Inspección',
    description: 'Ten a la mano tu pase de abordar e identificación oficial para ingresar a la zona de salas de última espera.',
    badges: ['Pase de Abordar', 'Identificación Oficial', 'Filtro Central'],
    linkLabel: 'Ver requisitos de acceso →',
    href: 'https://aifa.aero',
    icon: ShieldCheck
  },
  {
    title: '3. Salas de Ultramar y Abordaje',
    description: 'Revisa las pantallas de vuelos para confirmar tu sala y puerta de abordaje. Disfruta de tiendas, servicios y áreas de descanso.',
    badges: ['Puertas A1-A12', 'Pantallas de Vuelos', 'Área Comercial'],
    linkLabel: 'Ubicar mi puerta →',
    href: '/images/aifa-mapa.png',
    icon: PlaneTakeoff
  }
];
const PICKUP_GUIDE_STEPS = [
  {
    title: '1. Puntos de Encuentro y Espera',
    description: 'Ubica las áreas de llegadas nacionales e internacionales. Revisa las pantallas de vuelos en tiempo real para conocer el estatus de llegada.',
    badges: ['Llegadas Nacionales', 'Llegadas Internacionales', 'Pantallas de Vuelo'],
    linkLabel: 'Ver mapa de puntos de encuentro →',
    href: '/images/aifa-mapa.png',
    icon: UsersRound
  },
  {
    title: '2. Estacionamiento y Tiempo',
    description: 'Accede al estacionamiento principal o utiliza la zona de espera corta para coordinar el momento exacto en que tu pasajero salga de la terminal.',
    badges: ['Estacionamiento Principal', 'Pago Digital / Tarjeta', 'Zona de Carga'],
    linkLabel: 'Tarifas y ubicación de estacionamiento →',
    href: 'https://aifa.aero',
    icon: Car
  },
  {
    title: '3. Servicios de Espera Confortable',
    description: 'Encuentra áreas de descanso, cafeterías, tiendas de conveniencia y sanitarios mientras esperas la llegada de tu vuelo.',
    badges: ['Cafeterías', 'Sanitarios Temáticos', 'WiFi Gratuito'],
    linkLabel: 'Ver amenidades de espera →',
    href: '/images/aifa-mapa.png',
    icon: Coffee
  }
];
const TOURISM_ATTRACTIONS = [
  { title: 'Museo del Mamut (Quinametzin)', image: '/images/museo-mamut.jpg', badges: ['Fósiles', 'Tierra de Gigantes'] },
  { title: 'Museo de la Aviación Militar (MAM)', image: '/images/aviacion-militar.jpg', badges: ['Aeronaves', 'Fuerza Aérea'] },
  { title: 'Tren Presidencial Olivo', image: '/images/tren-olivo.jpg', badges: ['Vagón Histórico', 'Historia'] }
];
const TOURISM_COMMERCIAL_ATTRACTIONS = [
  { title: 'Baños Temáticos', image: '/images/banos-tematicos.jpg', badges: ['Lucha Libre', 'Cine Mexicano', 'Chespirito'] },
  { title: 'Plaza Comercial Mexica', image: '/images/plaza-mexica.jpg', badges: ['Artesanías', 'Souvenirs', 'Gastronomía'] }
];
const QR_CODE_ROUTES: Record<string, QrRoute> = {
  'QR-MEXIBUS-01': { role: 'transport' },
  'QR-LLEGADAS-01': { role: 'arrival' },
  'QR-SALIDAS-01': { role: 'departure' },
  'PUERTA-108': { role: 'departure', locationId: 'puerta-108' },
  'QR-BANOS-TEMATICOS': { role: 'tourism', locationId: 'banos-lucha-libre' },
  'BANOS-LUCHA-LIBRE': { role: 'tourism', locationId: 'banos-lucha-libre' },
  'QR-PUNTO-REUNION': { role: 'pickup' },
  'QR-MODULO-TIA': { activateTia: true }
};
const MAIN_ROLE_CARD_STYLES: Record<MainRoleId, { image?: string; base: string; overlay: string }> = {
  arrival: {
    image: '/images/llegadas-bg.jpg',
    base: 'bg-[#008767]',
    overlay: 'bg-gradient-to-t from-[#00382b]/90 via-[#008767]/60 to-transparent'
  },
  departure: {
    image: '/images/salidas-bg.jpg',
    base: 'bg-[#2563eb]',
    overlay: 'bg-gradient-to-t from-[#0f172a]/90 via-[#2563eb]/60 to-transparent'
  },
  pickup: {
    image: '/images/encuentro-bg.jpg',
    base: 'bg-[#f97316]',
    overlay: 'bg-gradient-to-t from-[#7c2d12]/90 via-[#ea580c]/60 to-transparent'
  },
  tourism: {
    image: '/images/turismo-bg.jpg',
    base: 'bg-[#a855f7]',
    overlay: 'bg-gradient-to-t from-[#581c87]/90 via-[#8b5cf6]/60 to-transparent'
  }
};
const TIME_THEMES: Record<'morning' | 'afternoon' | 'night', TimeTheme> = {
  morning: { label: 'Buenos días', image: '/images/hero-manana.jpg' },
  afternoon: { label: 'Buenas tardes', image: '/images/hero-tarde.jpg' },
  night: { label: 'Buenas noches', image: '/images/hero-noche.jpg' }
};

function getTimeTheme(date: Date | null): TimeTheme {
  if (!date) return TIME_THEMES.morning;
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return TIME_THEMES.morning;
  if (hour >= 12 && hour < 19) return TIME_THEMES.afternoon;
  return TIME_THEMES.night;
}

function formatDigitalClock(date: Date | null): string {
  if (!date) return '--/--  --:--';
  const dateLabel = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: '2-digit' }).format(date);
  const timeLabel = new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
  return `${dateLabel}  ${timeLabel}`;
}

function normalizeQrToken(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();
}

function getLocationRole(location: Location): RoleId {
  if (location.category === 'puertas') return 'departure';
  if (location.category === 'turismo' || location.category === 'comida') return 'tourism';
  return 'arrival';
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const playClickSound = useClickSound();
  const [screen, setScreen] = useState<Screen>('welcome');
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [selectedSurveyOption, setSelectedSurveyOption] = useState<OpcionEncuesta | null>(null);
  const [surveyDetails, setSurveyDetails] = useState('');
  const [surveyFinished, setSurveyFinished] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [qrScanMessage, setQrScanMessage] = useState('');
  const [qrTargetLocation, setQrTargetLocation] = useState<Location | null>(null);
  const [isTiaBannerActive, setIsTiaBannerActive] = useState(false);
  const [isWelcomeFading, setIsWelcomeFading] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const updateClock = () => setCurrentTime(new Date());
    updateClock();
    const intervalId = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isWelcomeFading) return;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 700;
    const timeoutId = window.setTimeout(() => {
      setScreen('hub');
      setIsWelcomeFading(false);
    }, duration);
    return () => window.clearTimeout(timeoutId);
  }, [isWelcomeFading]);

  useEffect(() => {
    if (screen !== 'hub' || !isTiaBannerActive) return;
    const frameId = window.requestAnimationFrame(() => {
      document.getElementById('tia-help')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'center'
      });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [isTiaBannerActive, screen]);

  const openRole = (roleId: RoleId) => {
    setQrTargetLocation(null);
    setIsTiaBannerActive(false);
    setSelectedRole(roleId);
    setScreen('role');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const returnToMenu = useCallback(() => {
    setQrTargetLocation(null);
    setIsTiaBannerActive(false);
    setSelectedRole(null);
    setScreen('hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (screen !== 'role' || !['arrival', 'departure', 'pickup', 'tourism'].includes(selectedRole ?? '')) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        returnToMenu();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [returnToMenu, screen, selectedRole]);

  const openSurvey = () => {
    setSelectedSurveyOption(null);
    setSurveyDetails('');
    setSurveyFinished(false);
    setScreen('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectSurveyOption = (option: OpcionEncuesta) => {
    setSelectedSurveyOption(option);
    setSurveyDetails('');
    setSurveyFinished(false);
  };

  const beginExperience = () => {
    if (!isWelcomeFading) setIsWelcomeFading(true);
  };

  const handleQrScan = (value: string) => {
    let qrToken = value.trim();
    try {
      const scannedUrl = new URL(value, window.location.origin);
      const pathToken = scannedUrl.pathname.split('/').filter(Boolean).pop();
      qrToken = decodeURIComponent(scannedUrl.searchParams.get('origen') ?? pathToken ?? value).trim();
    } catch {
      qrToken = value.trim();
    }
    const normalizedToken = normalizeQrToken(qrToken);
    const route = QR_CODE_ROUTES[normalizedToken];
    const location = route?.locationId
      ? MOCK_LOCATIONS[route.locationId]
      : Object.values(MOCK_LOCATIONS).find((candidate) => {
        const normalizedId = normalizeQrToken(candidate.id);
        return normalizedToken === normalizedId || normalizedToken.includes(normalizedId);
      });

    if (route?.activateTia) {
      setQrTargetLocation(null);
      setIsTiaBannerActive(true);
      setQrScanMessage('');
      setSelectedRole(null);
      setScreen('hub');
      return;
    }

    const roleId = route?.role ?? (location ? getLocationRole(location) : null);
    if (roleId) {
      setQrTargetLocation(location ?? null);
      setIsTiaBannerActive(false);
      setQrScanMessage('');
      setSelectedRole(roleId);
      setScreen('role');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setQrTargetLocation(null);
    setQrScanMessage('Código QR leído, pero la ubicación no está registrada en la guía.');
  };

  const activeRole = selectedRole ? ROLE_INFO[selectedRole] : null;
  const ActiveRoleIcon = activeRole?.icon;
  const timeTheme = getTimeTheme(currentTime);
  const roleModules: SubModulo[] | null = selectedRole === 'tourism'
    ? TURISMO_DATA
    : selectedRole === 'transport'
      ? TRANSPORTE_DATA
      : null;
  const surveyResponse = selectedSurveyOption
    ? RESPUESTAS_PANTALLA[selectedSurveyOption.categoria]
    : null;

  return (
    <main className="min-h-screen scroll-smooth bg-slate-950 text-white motion-reduce:scroll-auto">
      {screen === 'welcome' && (
        <section
          aria-labelledby="welcome-title"
          className={`fixed inset-0 z-50 flex min-h-[100svh] items-center justify-center overflow-hidden bg-slate-950 transition-opacity duration-700 ease-out motion-reduce:duration-0 ${isWelcomeFading ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        >
          <Image src="/images/aifa-bienvenida.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/45 to-slate-950/75" aria-hidden="true" />
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 text-center sm:px-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200 sm:text-sm">AIFA · Guía de pasajeros</p>
            <h1 id="welcome-title" className="text-3xl font-bold leading-tight drop-shadow-lg sm:text-5xl">¡Te damos la bienvenida al AIFA!</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-100 drop-shadow sm:text-xl">Tu experiencia en el aeropuerto, guiada paso a paso con la tranquilidad y claridad que mereces.</p>
            <button
              type="button"
              autoFocus
              onClick={beginExperience}
              className="mt-8 inline-flex min-h-[56px] items-center justify-center gap-3 rounded-xl bg-emerald-400 px-7 py-3 text-base font-bold text-slate-950 shadow-xl shadow-emerald-950/40 transition hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-white/70"
            >
              Iniciar Experiencia <ArrowRight aria-hidden="true" size={20} />
            </button>
          </div>
        </section>
      )}

      <AnimatePresence initial={false}>
      {screen === 'hub' && (
        <motion.section key="hub" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
          <Image src="/images/aifa-terminal.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
          <div className="absolute inset-0 -z-10 bg-slate-950/75 backdrop-blur-sm" aria-hidden="true" />
          <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-4 pb-6 pt-8 sm:px-8 sm:pt-12">
            <header className="mb-7 sm:mb-9">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">AIFA · Guía de pasajeros</p>
                <h1 className="mt-2 max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">¿Cómo podemos ayudarte hoy?</h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">Elige lo que necesitas y te orientamos en tu visita.</p>
              </div>
            </header>

            <motion.button
              type="button"
              onClick={() => {
                playClickSound();
                setQrScanMessage('');
                setIsQrScannerOpen(true);
              }}
              whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="group relative isolate mb-7 flex min-h-64 w-full cursor-pointer items-center overflow-hidden rounded-3xl border border-cyan-100/70 bg-white/10 p-6 text-left text-white shadow-[0_0_32px_rgba(34,211,238,0.24)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-100 focus:outline-none focus:ring-4 focus:ring-cyan-100 sm:mb-9 sm:min-h-72 sm:p-10"
              aria-label="Abrir el escáner QR"
            >
              <Image
                src="/images/card-qr-scanner.jpg"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 1152px"
                className="-z-20 object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                priority
              />
              <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/30" />
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/30 shadow-[inset_0_0_32px_rgba(103,232,249,0.18)]" />
              <span className="relative z-10 flex max-w-3xl flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-100/60 bg-white/15 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.45)] backdrop-blur-md sm:h-20 sm:w-20">
                  <QrCode aria-hidden="true" size={40} strokeWidth={1.7} />
                </span>
                <span className="drop-shadow-lg">
                  <span className="block text-2xl font-extrabold leading-tight sm:text-4xl">¡ALTO! 📱 Vive la Experiencia Digital AIFA</span>
                  <span className="mt-3 block max-w-2xl text-base font-medium leading-relaxed text-cyan-50 sm:text-lg">Abre tu cámara, escanea los códigos del aeropuerto y navega en tiempo real desde tu celular.</span>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-100/60 bg-cyan-200/15 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-md transition-colors group-hover:bg-cyan-200/25">
                    Escanear QR <ArrowRight aria-hidden="true" size={18} />
                  </span>
                </span>
              </span>
            </motion.button>

            {qrScanMessage && (
              <p className="mb-4 rounded-xl border border-emerald-200/40 bg-emerald-900/80 px-4 py-3 text-sm font-semibold text-white" role="status" aria-live="polite">
                {qrScanMessage}
              </p>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {MAIN_ROLE_IDS.map((roleId) => {
                const role = ROLE_INFO[roleId];
                const Icon = role.icon;
                const cardStyle = MAIN_ROLE_CARD_STYLES[roleId];
                return (
                  <motion.button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      openRole(role.id);
                    }}
                    layoutId={roleId === 'arrival' ? 'card-llegue' : roleId === 'departure' ? 'card-viajar' : roleId === 'pickup' ? 'card-vengo' : roleId === 'tourism' ? 'card-turismo' : undefined}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={`group relative isolate flex min-h-[200px] cursor-pointer items-center gap-5 overflow-hidden rounded-2xl border border-white/20 ${cardStyle.base} px-6 py-8 text-left text-white shadow-lg transition-all duration-500 hover:scale-[1.02] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-white sm:min-h-52 sm:p-8`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={cardStyle.image ? { backgroundImage: `url("${cardStyle.image}")` } : undefined}
                    />
                    <span aria-hidden="true" className={`absolute inset-0 ${cardStyle.overlay}`} />
                    <span className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white drop-shadow-md transition-colors group-hover:bg-white/30">
                      <Icon aria-hidden="true" size={32} strokeWidth={1.8} />
                    </span>
                    <span className="relative z-10 min-w-0 flex-1 drop-shadow-md">
                      <span className="block text-2xl font-bold leading-snug text-white md:text-3xl">{role.title}</span>
                      <span className="mt-2 block text-base font-semibold leading-relaxed text-white md:text-lg">{role.subtitle}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="relative z-10 shrink-0 text-white/75 drop-shadow-md transition group-hover:translate-x-1 group-hover:text-white" size={20} />
                  </motion.button>
                );
              })}
            </div>

          </div>

          <div className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-8">
            <div className="mx-auto w-full max-w-5xl space-y-6">
              <aside id="tia-help" className={`flex flex-col items-start gap-y-1 rounded-2xl border border-red-200/70 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-5 py-4 text-white shadow-xl shadow-red-950/40 transition-all duration-500 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3 sm:px-6 ${isTiaBannerActive ? 'ring-4 ring-white ring-offset-4 ring-offset-red-800' : ''}`}>
                <h2 className="text-base font-bold leading-tight sm:shrink-0 sm:text-lg">{TIA_INFO_BANNER.titulo}</h2>
                <p className="w-full min-w-0 text-sm leading-relaxed text-white sm:w-auto sm:flex-1 sm:text-base">{TIA_INFO_BANNER.mensaje}</p>
              </aside>

              <nav aria-label="Ayuda rápida">
                <p className="mb-3 text-base font-bold uppercase tracking-[0.14em] text-white">Ayuda rápida</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                {SUPPORT_ROLE_IDS.map((roleId) => {
                  const role = ROLE_INFO[roleId];
                  const Icon = role.icon;
                  const backgroundImage = roleId === 'transport'
                    ? '/images/btn-transporte.jpg'
                    : roleId === 'lost-items'
                      ? '/images/btn-objetos-olvidados.jpg'
                      : '/images/btn-mascotas.jpg';
                  return (
                    <motion.button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        openRole(role.id);
                      }}
                      whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.02 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="group relative isolate flex min-h-28 items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/30 bg-white/10 bg-cover bg-center px-4 py-5 text-center text-base font-bold text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:border-white/70 focus:outline-none focus:ring-4 focus:ring-white sm:text-lg"
                      style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.72)), url("${backgroundImage}")` }}
                    >
                      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/5 transition-colors duration-300 group-hover:bg-sky-400/10" />
                      <Icon aria-hidden="true" size={28} className="relative z-10 shrink-0 text-white drop-shadow-md" />
                      <span className="relative z-10 text-lg leading-snug drop-shadow-md sm:text-xl">{role.title}</span>
                    </motion.button>
                  );
                })}
                </div>
              </nav>
              <motion.button
                type="button"
                onClick={() => {
                  playClickSound();
                  openSurvey();
                }}
                whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.015 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="relative isolate inline-flex min-h-16 w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/30 bg-white/10 bg-cover bg-center px-6 py-4 text-lg font-bold text-white shadow-xl shadow-red-950/50 backdrop-blur-md transition-colors duration-300 hover:border-white/70 focus:outline-none focus:ring-4 focus:ring-white sm:text-xl"
                style={{ backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.42), rgba(15, 23, 42, 0.7)), url("/images/btn-experiencia.jpg")' }}
              >
                <MessageCircle aria-hidden="true" size={22} className="relative z-10 text-white drop-shadow-md" />
                <span className="relative z-10 drop-shadow-md">Cuéntanos tu experiencia</span>
                <ArrowRight aria-hidden="true" size={20} className="relative z-10 text-white drop-shadow-md" />
              </motion.button>
            </div>
          </div>
        </motion.section>
      )}

      {screen === 'role' && activeRole && (
        selectedRole === 'arrival' ? (
          <motion.section
            key="arrival"
            layoutId="card-llegue"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            aria-labelledby="arrival-guide-title"
            className="fixed inset-0 z-50 isolate min-h-screen overflow-y-auto overflow-x-hidden bg-transparent"
          >
            <div
              aria-hidden="true"
              className="fixed inset-0 z-0 h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/images/llegadas-bg.jpg')" }}
            />
            <div aria-hidden="true" className="fixed inset-0 z-0 bg-slate-950/40" />
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 18% 38%, rgba(110, 231, 183, 0.15), transparent 30%), radial-gradient(circle at 82% 62%, rgba(167, 243, 208, 0.1), transparent 34%)'
              }}
            />

            <motion.div
              className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-8 sm:py-10"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.16 } }
              }}
            >
              <motion.header
                className="mb-8 sm:mb-10"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20, staggerChildren: 0.12 } }
                }}
              >
                <motion.button
                  type="button"
                  onClick={returnToMenu}
                  whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  className="mb-7 inline-flex min-h-14 items-center gap-3 rounded-xl border border-emerald-200/40 bg-black/50 px-5 py-3 text-base font-bold text-white shadow-lg drop-shadow-md transition hover:bg-emerald-950/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
                >
                  <ArrowLeft aria-hidden="true" size={28} />
                  Volver al Menú Principal
                </motion.button>
                <motion.h1
                  id="arrival-guide-title"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  className="text-3xl font-extrabold text-white drop-shadow-md md:text-5xl"
                >
                  Llegué en un vuelo
                </motion.h1>
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  className="mt-3 max-w-3xl text-lg leading-relaxed text-emerald-100 drop-shadow-md md:text-xl"
                >
                  Equipaje, migración y salida: encuentra lo que necesitas para continuar tu recorrido por el AIFA.
                </motion.p>
              </motion.header>

              <motion.div
                className="grid flex-1 content-start gap-5 lg:grid-cols-2 xl:grid-cols-3"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.12 } }
                }}
              >
                {ARRIVAL_GUIDE_STEPS.map(({ title, description, badges, icon: StepIcon }) => (
                  <motion.article
                    key={title}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                    }}
                    whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.02 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="rounded-3xl border border-white/30 bg-white/10 p-8 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:border-emerald-300 hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.6),0_0_40px_rgba(16,185,129,0.4)]"
                  >
                    <div className="mb-4 inline-block rounded-2xl border border-emerald-300/40 bg-emerald-400/20 p-3 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md">
                      <StepIcon aria-hidden="true" size={38} strokeWidth={1.8} />
                    </div>
                    <h2 className="mb-3 text-2xl font-bold leading-snug text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{title}</h2>
                    <p className="mb-6 text-base leading-relaxed text-slate-100/90">{description}</p>
                    <ul aria-label={`Servicios: ${title}`} className="flex flex-wrap gap-3">
                      {badges.map((badge) => (
                        <li key={badge} className="inline-flex min-h-11 items-center rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-emerald-100 backdrop-blur-sm transition-all hover:border-emerald-300 hover:bg-emerald-500/30">
                          {badge}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="/images/aifa-mapa.png"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 block text-sm font-bold text-[#008767] hover:underline focus:outline-none focus-visible:underline focus-visible:ring-2 focus-visible:ring-[#008767] focus-visible:ring-offset-2"
                    >
                      Ver mapa de ubicación →
                    </a>
                  </motion.article>
                ))}
              </motion.div>

              {qrTargetLocation && (
                <section className="mt-7 rounded-2xl border-2 border-emerald-300/50 bg-black/70 p-6 text-white shadow-xl backdrop-blur-md" aria-labelledby="qr-location-title">
                  <p className="text-sm font-bold uppercase tracking-wider text-emerald-200 drop-shadow-md">Ubicación detectada</p>
                  <h2 id="qr-location-title" className="mt-2 text-xl font-extrabold drop-shadow-md">{qrTargetLocation.translations.ES.title}</h2>
                  <p className="mt-2 text-lg leading-relaxed text-slate-100 drop-shadow-md">{qrTargetLocation.translations.ES.description}</p>
                  <p className="mt-3 flex items-center gap-2 text-base font-bold text-emerald-100 drop-shadow-md">
                    <MapPin aria-hidden="true" size={20} /> {qrTargetLocation.mapZone} · {qrTargetLocation.walkTime}
                  </p>
                  {qrTargetLocation.quickTip?.ES && <p className="mt-3 text-base leading-relaxed text-emerald-50 drop-shadow-md">{qrTargetLocation.quickTip.ES}</p>}
                </section>
              )}
            </motion.div>
          </motion.section>
        ) : selectedRole === 'pickup' ? (
          <motion.section
            key="pickup"
            layoutId="card-vengo"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            aria-labelledby="pickup-guide-title"
            className="fixed inset-0 z-50 isolate min-h-screen overflow-y-auto overflow-x-hidden bg-transparent"
          >
            <div
              aria-hidden="true"
              className="fixed inset-0 z-0 h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/images/encuentro-bg.jpg')" }}
            />
            <div aria-hidden="true" className="fixed inset-0 z-0 bg-slate-950/40" />
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 18% 38%, rgba(245, 158, 11, 0.15), transparent 30%), radial-gradient(circle at 82% 62%, rgba(251, 191, 36, 0.1), transparent 34%)'
              }}
            />

            <motion.div
              className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-8 sm:py-10"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.16 } }
              }}
            >
              <motion.header
                className="mb-8 sm:mb-10"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20, staggerChildren: 0.12 } }
                }}
              >
                <motion.button
                  type="button"
                  onClick={returnToMenu}
                  whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  className="mb-7 inline-flex min-h-14 items-center gap-3 rounded-xl border border-amber-200/40 bg-black/50 px-5 py-3 text-base font-bold text-white shadow-lg drop-shadow-md transition hover:bg-amber-950/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
                >
                  <ArrowLeft aria-hidden="true" size={28} />
                  Volver al Menú Principal
                </motion.button>
                <motion.h1
                  id="pickup-guide-title"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  className="text-3xl font-extrabold text-white drop-shadow-md md:text-5xl"
                >
                  Vengo por alguien
                </motion.h1>
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  className="mt-3 max-w-3xl text-lg leading-relaxed text-amber-100 drop-shadow-md md:text-xl"
                >
                  Puntos de encuentro, estacionamiento y servicios para esperar con comodidad la llegada de tu pasajero.
                </motion.p>
              </motion.header>

              <motion.div
                className="grid flex-1 content-start gap-5 lg:grid-cols-2 xl:grid-cols-3"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.12 } }
                }}
              >
                {PICKUP_GUIDE_STEPS.map(({ title, description, badges, linkLabel, href, icon: StepIcon }) => (
                  <motion.article
                    key={title}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                    }}
                    whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.02 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="rounded-3xl border border-white/30 bg-white/10 p-8 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:border-amber-300 hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.6),0_0_40px_rgba(245,158,11,0.4)]"
                  >
                    <div className="mb-4 inline-block rounded-2xl border border-amber-300/40 bg-amber-400/20 p-3 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)] backdrop-blur-md">
                      <StepIcon aria-hidden="true" size={38} strokeWidth={1.8} />
                    </div>
                    <h2 className="mb-3 text-2xl font-bold leading-snug text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{title}</h2>
                    <p className="mb-6 text-base leading-relaxed text-slate-100/90">{description}</p>
                    <ul aria-label={`Servicios: ${title}`} className="flex flex-wrap gap-3">
                      {badges.map((badge) => (
                        <li key={badge} className="inline-flex min-h-11 items-center rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-amber-100 backdrop-blur-sm transition-all hover:border-amber-300 hover:bg-amber-500/30">
                          {badge}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={href}
                      target={href.startsWith('https://') ? '_blank' : undefined}
                      rel={href.startsWith('https://') ? 'noreferrer' : undefined}
                      className="mt-4 block text-sm font-bold text-[#fbbf24] hover:underline focus:outline-none focus-visible:underline focus-visible:ring-2 focus-visible:ring-[#fbbf24] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                      {linkLabel}
                    </a>
                  </motion.article>
                ))}
              </motion.div>

              {qrTargetLocation && (
                <section className="mt-7 rounded-2xl border-2 border-amber-300/50 bg-black/70 p-6 text-white shadow-xl backdrop-blur-md" aria-labelledby="qr-location-title">
                  <p className="text-sm font-bold uppercase tracking-wider text-amber-200 drop-shadow-md">Ubicación detectada</p>
                  <h2 id="qr-location-title" className="mt-2 text-xl font-extrabold drop-shadow-md">{qrTargetLocation.translations.ES.title}</h2>
                  <p className="mt-2 text-lg leading-relaxed text-slate-100 drop-shadow-md">{qrTargetLocation.translations.ES.description}</p>
                  <p className="mt-3 flex items-center gap-2 text-base font-bold text-amber-100 drop-shadow-md">
                    <MapPin aria-hidden="true" size={20} /> {qrTargetLocation.mapZone} · {qrTargetLocation.walkTime}
                  </p>
                  {qrTargetLocation.quickTip?.ES && <p className="mt-3 text-base leading-relaxed text-amber-50 drop-shadow-md">{qrTargetLocation.quickTip.ES}</p>}
                </section>
              )}
            </motion.div>
          </motion.section>
        ) : selectedRole === 'departure' ? (
          <motion.section
            key="departure"
            layoutId="card-viajar"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            aria-labelledby="departure-guide-title"
            className="fixed inset-0 z-50 isolate min-h-screen overflow-y-auto overflow-x-hidden bg-transparent"
          >
            <div
              aria-hidden="true"
              className="fixed inset-0 z-0 h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/images/salidas-bg.jpg')" }}
            />
            <div aria-hidden="true" className="fixed inset-0 z-0 bg-slate-950/40" />
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 18% 38%, rgba(56, 189, 248, 0.15), transparent 30%), radial-gradient(circle at 82% 62%, rgba(125, 211, 252, 0.1), transparent 34%)'
              }}
            />

            <motion.div
              className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-8 sm:py-10"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.16 } }
              }}
            >
              <motion.header
                className="mb-8 sm:mb-10"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20, staggerChildren: 0.12 } }
                }}
              >
                <motion.button
                  type="button"
                  onClick={returnToMenu}
                  whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  className="mb-7 inline-flex min-h-14 items-center gap-3 rounded-xl border border-sky-200/40 bg-black/50 px-5 py-3 text-base font-bold text-white shadow-lg drop-shadow-md transition hover:bg-blue-950/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
                >
                  <ArrowLeft aria-hidden="true" size={28} />
                  Volver al Menú Principal
                </motion.button>
                <motion.h1
                  id="departure-guide-title"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  className="text-3xl font-extrabold text-white drop-shadow-md md:text-5xl"
                >
                  Voy a viajar
                </motion.h1>
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  className="mt-3 max-w-3xl text-lg leading-relaxed text-sky-100 drop-shadow-md md:text-xl"
                >
                  Check-in, filtros y salas: prepara tu salida y ubica cada etapa antes de abordar.
                </motion.p>
              </motion.header>

              <div className="mb-7">
                <FlightTimeModule currentTime={currentTime} origin={MOCK_LOCATIONS['entrada-principal']} />
              </div>

              <motion.div
                className="grid flex-1 content-start gap-5 lg:grid-cols-2 xl:grid-cols-3"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.12 } }
                }}
              >
                {DEPARTURE_GUIDE_STEPS.map(({ title, description, badges, linkLabel, href, icon: StepIcon }) => (
                  <motion.article
                    key={title}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                    }}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="rounded-3xl border border-white/30 bg-white/10 p-8 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-950/30 hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.6),0_0_40px_rgba(56,189,248,0.4)]"
                  >
                    <div className="mb-4 inline-block rounded-2xl border border-sky-300/40 bg-sky-400/20 p-3 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.3)] backdrop-blur-md">
                      <StepIcon aria-hidden="true" size={38} strokeWidth={1.8} />
                    </div>
                    <h2 className="mb-3 text-2xl font-bold leading-snug tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{title}</h2>
                    <p className="mb-6 text-base font-normal leading-relaxed text-slate-100/90">{description}</p>
                    <ul aria-label={`Servicios: ${title}`} className="flex flex-wrap gap-3">
                      {badges.map((badge) => (
                        <li key={badge} className="inline-flex min-h-11 items-center rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-sky-100 backdrop-blur-sm transition-all hover:border-sky-300 hover:bg-sky-500/30">
                          {badge}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={href}
                      target={href.startsWith('https://') ? '_blank' : undefined}
                      rel={href.startsWith('https://') ? 'noreferrer' : undefined}
                      className="mt-4 block text-sm font-bold text-[#38bdf8] hover:underline focus:outline-none focus-visible:underline focus-visible:ring-2 focus-visible:ring-[#38bdf8] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                      {linkLabel}
                    </a>
                  </motion.article>
                ))}
              </motion.div>

              {qrTargetLocation && (
                <section className="mt-7 rounded-2xl border-2 border-sky-300/50 bg-black/70 p-6 text-white shadow-xl backdrop-blur-md" aria-labelledby="qr-location-title">
                  <p className="text-sm font-bold uppercase tracking-wider text-sky-200 drop-shadow-md">Ubicación detectada</p>
                  <h2 id="qr-location-title" className="mt-2 text-xl font-extrabold drop-shadow-md">{qrTargetLocation.translations.ES.title}</h2>
                  <p className="mt-2 text-lg leading-relaxed text-slate-100 drop-shadow-md">{qrTargetLocation.translations.ES.description}</p>
                  <p className="mt-3 flex items-center gap-2 text-base font-bold text-sky-100 drop-shadow-md">
                    <MapPin aria-hidden="true" size={20} /> {qrTargetLocation.mapZone} · {qrTargetLocation.walkTime}
                  </p>
                  {qrTargetLocation.quickTip?.ES && <p className="mt-3 text-base leading-relaxed text-sky-50 drop-shadow-md">{qrTargetLocation.quickTip.ES}</p>}
                </section>
              )}
            </motion.div>
          </motion.section>
        ) : selectedRole === 'tourism' ? (
          <motion.section
            key="tourism"
            layoutId="card-turismo"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            aria-labelledby="tourism-guide-title"
            className="fixed inset-0 z-50 isolate min-h-screen w-full overflow-y-auto bg-transparent"
          >
            <div
              aria-hidden="true"
              className="fixed inset-0 z-0 h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/images/museo-mamut.jpg')" }}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-slate-950/40" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 18% 35%, rgba(139, 92, 246, 0.2), transparent 30%), radial-gradient(circle at 82% 65%, rgba(196, 181, 253, 0.12), transparent 34%)'
              }}
            />

            <motion.div
              className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-8 sm:py-10"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.14 } }
              }}
            >
              <motion.header
                className="mb-8 sm:mb-10"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20, staggerChildren: 0.12 } }
                }}
              >
                <motion.button
                  type="button"
                  onClick={returnToMenu}
                  whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  className="mb-7 inline-flex min-h-14 items-center gap-3 rounded-xl border border-violet-200/40 bg-black/50 px-5 py-3 text-base font-bold text-white shadow-lg drop-shadow-md transition hover:bg-violet-950/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
                >
                  <ArrowLeft aria-hidden="true" size={28} />
                  Volver al Menú Principal
                </motion.button>
                <motion.h1
                  id="tourism-guide-title"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  className="text-3xl font-extrabold text-white drop-shadow-md md:text-5xl"
                >
                  Paseo y Turismo
                </motion.h1>
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  className="mt-3 max-w-3xl text-lg leading-relaxed text-violet-100 drop-shadow-md md:text-xl"
                >
                  Explora los museos, experiencias comerciales y espacios fotográficos del AIFA.
                </motion.p>
              </motion.header>

              <motion.div
                className="space-y-6"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } }
                }}
              >
                <motion.section
                  aria-labelledby="tourism-culture-title"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="rounded-3xl border border-white/30 bg-white/10 p-8 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:border-purple-300 hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.6),0_0_40px_rgba(168,85,247,0.4)] md:p-10"
                >
                <h2 id="tourism-culture-title" className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-3xl">1. Corredor Cultural y Museos</h2>
                <p className="mt-3 text-base leading-relaxed text-slate-100/90">Descubre los espacios culturales únicos integrados dentro del área aeroportuaria.</p>
                  <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {TOURISM_ATTRACTIONS.map(({ title, image, badges }) => (
                      <motion.article
                        key={title}
                        whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.02 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="overflow-hidden rounded-2xl border border-white/30 bg-white/10 shadow-lg backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:border-purple-300 hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.6),0_0_40px_rgba(168,85,247,0.4)]"
                      >
                        <div className="relative aspect-[16/10] bg-slate-200">
                          <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{title}</h3>
                          <ul aria-label={`Atractivos: ${title}`} className="mt-4 flex flex-wrap gap-2">
                            {badges.map((badge) => (
                              <li key={badge} className="rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm font-semibold text-violet-100 backdrop-blur-sm">{badge}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.section>

                <motion.section
                  aria-labelledby="tourism-commercial-title"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="rounded-3xl border border-white/30 bg-white/10 p-8 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:border-purple-300 hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.6),0_0_40px_rgba(168,85,247,0.4)] md:p-10"
                >
                <h2 id="tourism-commercial-title" className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-3xl">2. Experiencia Comercial y Baños Temáticos</h2>
                <p className="mt-3 text-base leading-relaxed text-slate-100/90">Recorre los atractivos de la cultura popular mexicana dentro del terminal.</p>
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {TOURISM_COMMERCIAL_ATTRACTIONS.map(({ title, image, badges }) => (
                      <motion.article
                        key={title}
                        whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.02 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="overflow-hidden rounded-2xl border border-white/30 bg-white/10 shadow-lg backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:border-purple-300 hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.6),0_0_40px_rgba(168,85,247,0.4)]"
                      >
                        <div className="relative aspect-[16/10] bg-slate-200">
                          <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{title}</h3>
                          <ul aria-label={`Atractivos: ${title}`} className="mt-4 flex flex-wrap gap-2">
                            {badges.map((badge) => (
                              <li key={badge} className="rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm font-semibold text-violet-100 backdrop-blur-sm">{badge}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.section>

                <motion.section
                  aria-labelledby="tourism-photo-title"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                  }}
                  whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="rounded-3xl border border-white/30 bg-white/10 p-8 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:border-purple-300 hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.6),0_0_40px_rgba(168,85,247,0.4)] md:p-10"
                >
                <h2 id="tourism-photo-title" className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-3xl">3. Miradores y Zonas Fotográficas</h2>
                <p className="mt-3 text-base leading-relaxed text-slate-100/90">Encuentra las mejores ubicaciones para fotos de recuerdo con la torre de control y las letras monumentales.</p>
                  <ul aria-label="Puntos fotográficos" className="mt-5 flex flex-wrap gap-3">
                    {['Letras AIFA', 'Mirador Principal', 'Zonas Verdes'].map((badge) => (
                      <li key={badge} className="rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-violet-100 backdrop-blur-sm">{badge}</li>
                    ))}
                  </ul>
                  <a
                    href="/images/aifa-mapa.png"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 block text-sm font-bold text-violet-200 hover:underline focus:outline-none focus-visible:underline focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2"
                  >
                    Ver mapa de puntos fotográficos →
                  </a>
                </motion.section>
              </motion.div>

              {qrTargetLocation && (
                <section className="mt-7 rounded-2xl border-2 border-violet-300/50 bg-black/70 p-6 text-white shadow-xl backdrop-blur-md" aria-labelledby="qr-location-title">
                  <p className="text-sm font-bold uppercase tracking-wider text-violet-200 drop-shadow-md">Ubicación detectada</p>
                  <h2 id="qr-location-title" className="mt-2 text-xl font-extrabold drop-shadow-md">{qrTargetLocation.translations.ES.title}</h2>
                  <p className="mt-2 text-lg leading-relaxed text-slate-100 drop-shadow-md">{qrTargetLocation.translations.ES.description}</p>
                  <p className="mt-3 flex items-center gap-2 text-base font-bold text-violet-100 drop-shadow-md">
                    <MapPin aria-hidden="true" size={20} /> {qrTargetLocation.mapZone} · {qrTargetLocation.walkTime}
                  </p>
                  {qrTargetLocation.quickTip?.ES && <p className="mt-3 text-base leading-relaxed text-violet-50 drop-shadow-md">{qrTargetLocation.quickTip.ES}</p>}
                </section>
              )}
            </motion.div>
          </motion.section>
        ) : (
        <motion.section key={`role-${selectedRole}`} className={`relative isolate mx-auto flex min-h-[calc(100svh-15rem)] w-full ${selectedRole === 'transport' ? 'max-w-7xl' : 'max-w-5xl'} flex-col px-4 py-6 sm:min-h-[calc(100svh-12rem)] sm:px-8 sm:py-10`}>
          {['transport', 'lost-items', 'pets'].includes(selectedRole ?? '') && (
            <>
              <div aria-hidden="true" className="fixed inset-0 z-0">
                <Image
                  src={selectedRole === 'lost-items' ? '/images/btn-objetos-olvidados.jpg' : selectedRole === 'pets' ? '/images/btn-mascotas.jpg' : '/images/aifa-terminal.jpg'}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
              <div aria-hidden="true" className="fixed inset-0 z-0 bg-slate-950/65 backdrop-blur-[2px]" />
            </>
          )}
          <div className="relative z-10 flex flex-1 flex-col">
            <button
              type="button"
              onClick={returnToMenu}
              className="mb-5 inline-flex min-h-[48px] w-fit items-center gap-2 rounded-lg px-3 text-sm font-semibold text-emerald-200 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <ArrowLeft aria-hidden="true" size={19} /> Volver al Menú Principal
            </button>

          <article className={`relative isolate flex flex-1 flex-col overflow-hidden rounded-3xl ${['transport', 'lost-items', 'pets'].includes(selectedRole ?? '') ? 'border border-white/30 bg-white/5 shadow-xl backdrop-blur-md' : 'border border-white/10 bg-slate-900 shadow-2xl'}`}>
            <div className="absolute inset-x-0 top-0 h-48 overflow-hidden sm:h-60">
              <Image src={timeTheme.image} alt="" fill sizes="(max-width: 640px) 100vw, 960px" className="object-cover object-center" />
              <div className={`absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/65 ${['transport', 'lost-items', 'pets'].includes(selectedRole ?? '') ? 'to-slate-950/20' : 'to-slate-900'}`} aria-hidden="true" />
            </div>
            <div className="relative z-10 flex flex-1 flex-col p-5 pt-28 sm:p-8 sm:pt-36">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">{timeTheme.label} en el AIFA</p>
              <div className="mt-3 flex items-center gap-3">
                {ActiveRoleIcon && <ActiveRoleIcon aria-hidden="true" className="shrink-0 text-emerald-200" size={32} strokeWidth={1.8} />}
                <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{activeRole.title}</h1>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-300 sm:text-base">{activeRole.subtitle}</p>
              <p className={`mt-5 max-w-3xl text-base leading-relaxed text-slate-100 ${['lost-items', 'pets'].includes(selectedRole ?? '') ? 'rounded-2xl border border-white/30 bg-white/10 p-5 text-lg shadow-xl backdrop-blur-md' : ''}`}>{activeRole.description}</p>
              {qrTargetLocation && (
                <section className="mt-6 rounded-xl border border-emerald-200/40 bg-emerald-950/70 p-4 text-white" aria-labelledby="qr-location-title">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">Ubicación detectada</p>
                  <h2 id="qr-location-title" className="mt-1 text-lg font-bold">{qrTargetLocation.translations.ES.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-100">{qrTargetLocation.translations.ES.description}</p>
                  <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-100">
                    <MapPin aria-hidden="true" size={17} /> {qrTargetLocation.mapZone} · {qrTargetLocation.walkTime}
                  </p>
                  {qrTargetLocation.quickTip?.ES && <p className="mt-3 text-sm leading-relaxed text-emerald-50">{qrTargetLocation.quickTip.ES}</p>}
                </section>
              )}
              {roleModules ? (
                <div className="mt-7 space-y-8">
                  {roleModules.map((module) => (
                    <section key={module.id} aria-labelledby={`${module.id}-title`} className={selectedRole === 'transport' ? 'rounded-3xl border border-white/30 bg-white/10 p-5 text-white shadow-xl backdrop-blur-md sm:p-6' : undefined}>
                      <div className={selectedRole === 'transport' ? 'rounded-2xl border border-white/20 bg-white/10 p-4' : undefined}>
                        <h2 id={`${module.id}-title`} className="text-xl font-bold text-white sm:text-2xl">{module.titulo}</h2>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-100/90 sm:text-base">{module.descripcion}</p>
                      </div>
                      <ol className="mt-4 grid gap-4 lg:grid-cols-2">
                        {module.pasos.map((step, index) => (
                          <li key={step.id} className={selectedRole === 'transport' ? 'overflow-hidden rounded-3xl border border-white/30 bg-white/10 p-5 text-white shadow-xl backdrop-blur-md' : 'overflow-hidden border border-white/10 bg-slate-950/55'}>
                            {step.imagenUrl && (
                              <div className="relative mx-3 mt-3 aspect-[16/9] overflow-hidden rounded-2xl border border-white/20 bg-slate-800">
                                <FallbackImage
                                  key={step.id}
                                  src={step.imagenUrl}
                                  fallback={selectedRole === 'transport' ? '/images/aifa-mapa.png' : module.id === 'mexibus' ? '/images/rutas/mexibus-doc/paso-01.jpg' : '/images/aifa-mapa.png'}
                                  alt={step.titulo}
                                  sizes="(max-width: 1024px) 100vw, 50vw"
                                  className="object-cover"
                                  fill
                                />
                              </div>
                            )}
                            <div className="p-4 sm:p-5">
                              <div className="flex items-start gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-sm font-bold text-slate-950">{index + 1}</span>
                                <div>
                                  <h3 className="font-bold leading-snug text-white">{step.titulo}</h3>
                                  <p className="mt-2 text-sm leading-relaxed text-slate-100/90">{step.descripcion}</p>
                                </div>
                              </div>
                              {step.sabiasQue && (
                                <p className={`mt-4 rounded-2xl border px-3 py-2 text-sm leading-relaxed ${selectedRole === 'transport' ? 'border-emerald-400/40 bg-emerald-500/20 text-emerald-100' : 'border-l-2 border-amber-300 bg-amber-300/10 text-amber-100'}`}>
                                  <strong>Recomendación:</strong> {step.sabiasQue}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </section>
                  ))}
                  {selectedRole === 'transport' && (
                    <section aria-labelledby="transport-route-gallery-title" className="rounded-3xl border border-white/30 bg-white/10 p-5 text-white shadow-xl backdrop-blur-md sm:p-6">
                      <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                        <h2 id="transport-route-gallery-title" className="text-xl font-bold text-white sm:text-2xl">Ruta Mexibús a documentación</h2>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-100/90 sm:text-base">Sigue las imágenes en orden desde la estación hasta los mostradores de equipaje.</p>
                      </div>
                      <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {mexibusToDocRoute.map((step) => (
                          <li key={step.stepNumber} className="overflow-hidden rounded-3xl border border-white/30 bg-white/10 p-4 text-white shadow-xl backdrop-blur-md">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20">
                              <Image
                                src={step.image}
                                alt={`${step.title}: ${step.stage}`}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover"
                              />
                            </div>
                            <div className="mt-4 flex items-start gap-3">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-sm font-bold text-slate-950">{step.stepNumber}</span>
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-emerald-100">{step.stage}</p>
                                <h3 className="mt-1 font-bold leading-snug text-white">{step.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-100/90">{step.description}</p>
                                {step.referencePoint && <p className="mt-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/20 p-3 text-sm leading-relaxed text-emerald-100"><strong>Referencia:</strong> {step.referencePoint}</p>}
                                {step.accessibilityNote && <p className="mt-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/20 p-3 text-sm leading-relaxed text-emerald-100"><strong>Accesibilidad:</strong> {step.accessibilityNote}</p>}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </section>
                  )}
                </div>
              ) : (
                <ol className={`mt-7 grid gap-4 ${['lost-items', 'pets'].includes(selectedRole ?? '') ? 'md:grid-cols-2' : 'space-y-3'}`}>
                  {activeRole.steps.map((step, index) => (
                    <motion.li
                      key={step}
                      whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                      className={`flex min-h-24 items-start gap-3 rounded-3xl p-5 text-white transition-colors duration-300 ${['lost-items', 'pets'].includes(selectedRole ?? '') ? 'border border-white/30 bg-white/10 text-lg shadow-xl backdrop-blur-md hover:border-emerald-200/70 hover:bg-white/15' : 'border border-white/10 bg-slate-950/50'}`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-sm font-bold text-slate-950">{index + 1}</span>
                      <span className="pt-0.5 text-base leading-relaxed text-slate-100">{step}</span>
                    </motion.li>
                  ))}
                </ol>
              )}
              <motion.button
                type="button"
                onClick={returnToMenu}
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-base font-semibold text-white shadow-lg backdrop-blur-md transition-colors duration-300 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-emerald-300 sm:w-fit"
              >
                <ArrowLeft aria-hidden="true" size={18} /> Volver al Menú Principal
              </motion.button>
            </div>
          </article>
          </div>
        </motion.section>
        )
      )}
      </AnimatePresence>

      {screen === 'hub' && (
        <QrScannerModal
          isOpen={isQrScannerOpen}
          language="ES"
          onClose={() => setIsQrScannerOpen(false)}
          onScan={handleQrScan}
        />
      )}

      {screen === 'survey' && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
          className="relative isolate min-h-[calc(100svh-15rem)] overflow-hidden sm:min-h-[calc(100svh-12rem)]"
        >
          <div aria-hidden="true" className="fixed inset-0 z-0">
            <Image src="/images/btn-experiencia.jpg" alt="" fill sizes="100vw" className="object-cover object-center" />
          </div>
          <div aria-hidden="true" className="fixed inset-0 z-0 bg-slate-950/70 backdrop-blur-sm" />
          <div className="relative z-10 mx-auto min-h-[calc(100svh-15rem)] w-full max-w-5xl px-4 py-6 sm:min-h-[calc(100svh-12rem)] sm:px-8 sm:py-10">
          <motion.button
            type="button"
            onClick={selectedSurveyOption ? () => setSelectedSurveyOption(null) : returnToMenu}
            whileHover={shouldReduceMotion ? undefined : { x: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            className="mb-5 inline-flex min-h-14 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 text-base font-semibold text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          >
            <ArrowLeft aria-hidden="true" size={19} /> {selectedSurveyOption ? 'Volver a las opciones' : 'Volver al Menú Principal'}
          </motion.button>

          {!selectedSurveyOption ? (
            <div>
              <header className="mb-7 rounded-3xl border border-white/30 bg-white/10 p-6 text-white shadow-xl backdrop-blur-md sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Tu experiencia importa</p>
                <h1 className="mt-2 text-2xl font-bold sm:text-3xl">¿Cómo estuvo tu visita?</h1>
                <p className="mt-2 text-base leading-relaxed text-slate-100">Elige la opción que mejor describe lo que viviste.</p>
              </header>
              {(['halago', 'queja'] as const).map((category) => (
                <motion.section
                  key={category}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  className="mb-6 rounded-3xl border border-white/30 bg-white/10 p-5 text-white shadow-xl backdrop-blur-md sm:p-6"
                  aria-labelledby={`survey-${category}`}
                >
                  <h2 id={`survey-${category}`} className="mb-4 flex items-center gap-3 text-xl font-bold sm:text-2xl">
                    {category === 'halago'
                      ? <Check aria-hidden="true" size={24} className="text-emerald-300" />
                      : <TriangleAlert aria-hidden="true" size={24} className="text-amber-300" />}
                    {category === 'halago' ? 'Quiero reconocer algo' : 'Quiero compartir algo por mejorar'}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {OPCIONES_ENCUESTA.filter((option) => option.categoria === category).map((option) => (
                      <motion.button
                        key={option.id}
                        type="button"
                        onClick={() => selectSurveyOption(option)}
                        whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                        className={`group relative isolate flex min-h-32 items-center gap-4 overflow-hidden rounded-3xl border border-white/30 ${option.colorBg} bg-white/10 px-5 py-6 text-left text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:border-white/80 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white`}
                      >
                        <span className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
                          {option.imagenFondo && (
                            <Image
                              src={option.imagenFondo}
                              alt=""
                              fill
                              sizes="(max-width: 640px) 100vw, 50vw"
                              className="object-cover opacity-35"
                            />
                          )}
                          <span className="absolute inset-0 bg-slate-950/35" />
                        </span>
                        <span className="relative z-10 flex w-full items-center gap-4">
                          <span className="shrink-0 text-3xl" aria-hidden="true">{option.icono}</span>
                          <span className="flex-1 text-lg font-bold leading-snug text-white drop-shadow-md sm:text-xl">{option.texto}</span>
                          <ArrowRight aria-hidden="true" size={22} className="shrink-0 text-white" />
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>
          ) : (
            <motion.article
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              className="relative isolate overflow-hidden rounded-3xl border border-white/30 bg-white/10 text-white shadow-2xl backdrop-blur-md"
            >
              <div aria-hidden="true" className="absolute inset-0 z-0">
                <Image src="/images/btn-experiencia.jpg" alt="" sizes="(max-width: 1024px) 100vw, 960px" className="object-cover opacity-25" fill />
                <div className="absolute inset-0 bg-slate-950/65" />
              </div>
              <div className="relative z-10 p-6 sm:p-8">
                <p className="text-3xl" aria-hidden="true">{selectedSurveyOption.icono}</p>
                <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                  {surveyFinished ? 'Gracias por compartir tu experiencia' : surveyResponse?.titulo}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-100 sm:text-base">
                  {surveyFinished
                    ? 'Tu comentario se mantiene en esta pantalla y no se envía al aeropuerto. Para recibir ayuda inmediata, acércate con confianza al personal TIA.'
                    : surveyResponse?.mensaje}
                </p>
                {surveyFinished && surveyDetails.trim() && (
                  <p className="mt-5 whitespace-pre-wrap rounded-2xl border border-emerald-400/40 bg-emerald-500/20 px-4 py-3 text-base leading-relaxed text-emerald-50">
                    {surveyDetails}
                  </p>
                )}
                {!surveyFinished && (
                  <>
                    <p className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-base font-semibold text-emerald-100">{selectedSurveyOption.texto}</p>
                    <label htmlFor="survey-details" className="mt-6 block text-base font-semibold text-white">{surveyResponse?.placeholderTexto}</label>
                    <textarea
                      id="survey-details"
                      value={surveyDetails}
                      onChange={(event) => setSurveyDetails(event.target.value)}
                      rows={4}
                      maxLength={500}
                      className="mt-2 w-full resize-y rounded-xl border border-white/30 bg-white/10 p-4 text-base leading-relaxed text-white placeholder:text-slate-300 backdrop-blur-md focus:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-300/50"
                    />
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      <MessageCircle aria-hidden="true" size={14} className="mr-1 inline" />
                      Este directorio no envía reportes; para atención inmediata, acércate al personal TIA.
                    </p>
                    <motion.button
                      type="button"
                      onClick={() => setSurveyFinished(true)}
                      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                      className="mt-5 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-emerald-200/70 bg-emerald-300 px-6 py-3 text-base font-bold text-slate-950 shadow-[0_0_24px_rgba(52,211,153,0.25)] transition-colors hover:bg-emerald-200 focus:outline-none focus:ring-4 focus:ring-white"
                    >
                      Finalizar <ArrowRight aria-hidden="true" size={18} />
                    </motion.button>
                  </>
                )}
                {surveyFinished && (
                  <motion.button
                    type="button"
                    onClick={returnToMenu}
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    className="mt-6 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                  >
                    Volver al Menú Principal <ArrowRight aria-hidden="true" size={18} />
                  </motion.button>
                )}
              </div>
            </motion.article>
          )}
          </div>
        </motion.section>
      )}

      {screen !== 'welcome' && (
        <footer className="border-t border-slate-800 bg-slate-900 px-4 py-6 text-center sm:px-8 sm:py-7">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 px-4 py-3 text-left text-slate-950 shadow-lg shadow-teal-950/30" aria-live="polite">
              <Clock3 aria-hidden="true" size={22} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em]">Hora local</p>
                <p className="font-mono text-lg font-bold tabular-nums">{formatDigitalClock(currentTime)}</p>
              </div>
            </div>
            <Link
              href="https://aifa.aero"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-white animate-pulse"
            >
              <ExternalLink aria-hidden="true" size={18} /> Sitio Oficial AIFA
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-slate-300 sm:text-right">Aeropuerto Internacional Felipe Ángeles — Guiando tu camino paso a paso.</p>
          </div>
        </footer>
      )}
    </main>
  );
}
