'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  Check,
  Clock3,
  ExternalLink,
  Landmark,
  MapPin,
  MessageCircle,
  PawPrint,
  Plane,
  QrCode,
  TrainFront,
  TriangleAlert,
  UsersRound,
  type LucideIcon
} from 'lucide-react';
import QrScannerModal from './QrScannerModal';
import { MOCK_LOCATIONS } from '@/data/locations';
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

  const returnToMenu = () => {
    setQrTargetLocation(null);
    setIsTiaBannerActive(false);
    setSelectedRole(null);
    setScreen('hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      {screen === 'hub' && (
        <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
          <Image src="/images/aifa-terminal.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
          <div className="absolute inset-0 -z-10 bg-slate-950/75 backdrop-blur-sm" aria-hidden="true" />
          <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-4 pb-6 pt-8 sm:px-8 sm:pt-12">
            <header className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">AIFA · Guía de pasajeros</p>
                <h1 className="mt-2 max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">¿Cómo podemos ayudarte hoy?</h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">Elige lo que necesitas y te orientamos en tu visita.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQrScanMessage('');
                  setIsQrScannerOpen(true);
                }}
                className="inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 self-start rounded-2xl border border-cyan-100/70 bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/40 transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white sm:self-auto"
              >
                <QrCode aria-hidden="true" size={21} />
                Escanear QR
              </button>
            </header>

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
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => openRole(role.id)}
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
                  </button>
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
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => openRole(role.id)}
                      className="flex min-h-24 items-center justify-center gap-3 rounded-2xl border border-red-200/70 bg-gradient-to-br from-red-700 via-rose-700 to-red-800 px-4 py-5 text-center text-base font-bold text-white shadow-lg transition hover:border-white hover:from-red-600 hover:via-rose-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 sm:text-lg"
                    >
                      <Icon aria-hidden="true" size={26} className="shrink-0 text-white" />
                      <span>{role.title}</span>
                    </button>
                  );
                })}
                </div>
              </nav>
              <button
                type="button"
                onClick={openSurvey}
                className="inline-flex min-h-16 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-red-100 bg-gradient-to-r from-red-500 via-rose-600 to-red-700 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-red-950/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-red-200"
              >
                <MessageCircle aria-hidden="true" size={22} className="text-white" />
                Cuéntanos tu experiencia
                <ArrowRight aria-hidden="true" size={20} className="text-white" />
              </button>
            </div>
          </div>
        </section>
      )}

      {screen === 'hub' && (
        <QrScannerModal
          isOpen={isQrScannerOpen}
          language="ES"
          onClose={() => setIsQrScannerOpen(false)}
          onScan={handleQrScan}
        />
      )}

      {screen === 'role' && activeRole && (
        <section className="mx-auto flex min-h-[calc(100svh-15rem)] w-full max-w-5xl flex-col px-4 py-6 sm:min-h-[calc(100svh-12rem)] sm:px-8 sm:py-10">
          <button
            type="button"
            onClick={returnToMenu}
            className="mb-5 inline-flex min-h-[48px] w-fit items-center gap-2 rounded-lg px-3 text-sm font-semibold text-emerald-200 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <ArrowLeft aria-hidden="true" size={19} /> Volver al Menú Principal
          </button>

          <article className="relative isolate flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-48 overflow-hidden sm:h-60">
              <Image src={timeTheme.image} alt="" fill sizes="(max-width: 640px) 100vw, 960px" className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/65 to-slate-900" aria-hidden="true" />
            </div>
            <div className="relative z-10 flex flex-1 flex-col p-5 pt-28 sm:p-8 sm:pt-36">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">{timeTheme.label} en el AIFA</p>
              <div className="mt-3 flex items-center gap-3">
                {ActiveRoleIcon && <ActiveRoleIcon aria-hidden="true" className="shrink-0 text-emerald-200" size={32} strokeWidth={1.8} />}
                <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{activeRole.title}</h1>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-300 sm:text-base">{activeRole.subtitle}</p>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-100">{activeRole.description}</p>
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
                    <section key={module.id} aria-labelledby={`${module.id}-title`}>
                      <h2 id={`${module.id}-title`} className="text-xl font-bold text-white sm:text-2xl">{module.titulo}</h2>
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">{module.descripcion}</p>
                      <ol className="mt-4 grid gap-4 lg:grid-cols-2">
                        {module.pasos.map((step, index) => {
                          const fallbackImage = selectedRole === 'tourism'
                            ? module.id === 'museos' ? '/images/museo-mamut.jpg' : '/images/aifa-terminal.jpg'
                            : module.id === 'mexibus' ? '/images/rutas/mexibus-doc/paso-01.jpg' : '/images/aifa-mapa.png';
                          return (
                            <li key={step.id} className="overflow-hidden border border-white/10 bg-slate-950/55">
                              {step.imagenUrl && (
                                <div className="relative aspect-[16/9] overflow-hidden bg-slate-800">
                                  <FallbackImage
                                    key={step.id}
                                    src={step.imagenUrl}
                                    fallback={fallbackImage}
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
                                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{step.descripcion}</p>
                                  </div>
                                </div>
                                {step.sabiasQue && (
                                  <p className="mt-4 border-l-2 border-amber-300 bg-amber-300/10 px-3 py-2 text-sm leading-relaxed text-amber-100">
                                    <strong>Recomendación:</strong> {step.sabiasQue}
                                  </p>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    </section>
                  ))}
                </div>
              ) : (
                <ol className="mt-7 space-y-3">
                  {activeRole.steps.map((step, index) => (
                    <li key={step} className="flex items-start gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-sm font-bold text-slate-950">{index + 1}</span>
                      <span className="pt-0.5 text-sm leading-relaxed text-slate-100">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
              <button
                type="button"
                onClick={returnToMenu}
                className="mt-7 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-300 sm:w-fit"
              >
                <ArrowLeft aria-hidden="true" size={18} /> Volver al Menú Principal
              </button>
            </div>
          </article>
        </section>
      )}

      {screen === 'survey' && (
        <section className="mx-auto min-h-[calc(100svh-15rem)] w-full max-w-5xl px-4 py-6 sm:min-h-[calc(100svh-12rem)] sm:px-8 sm:py-10">
          <button
            type="button"
            onClick={selectedSurveyOption ? () => setSelectedSurveyOption(null) : returnToMenu}
            className="mb-5 inline-flex min-h-[48px] items-center gap-2 px-3 text-sm font-semibold text-emerald-200 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <ArrowLeft aria-hidden="true" size={19} /> {selectedSurveyOption ? 'Volver a las opciones' : 'Volver al Menú Principal'}
          </button>

          {!selectedSurveyOption ? (
            <div>
              <header className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Tu experiencia importa</p>
                <h1 className="mt-2 text-2xl font-bold sm:text-3xl">¿Cómo estuvo tu visita?</h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">Elige la opción que mejor describe lo que viviste.</p>
              </header>
              {(['halago', 'queja'] as const).map((category) => (
                <section key={category} className="mb-8" aria-labelledby={`survey-${category}`}>
                  <h2 id={`survey-${category}`} className="mb-3 flex items-center gap-2 text-lg font-bold">
                    {category === 'halago'
                      ? <Check aria-hidden="true" size={20} className="text-emerald-300" />
                      : <TriangleAlert aria-hidden="true" size={20} className="text-amber-300" />}
                    {category === 'halago' ? 'Quiero reconocer algo' : 'Quiero compartir algo por mejorar'}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {OPCIONES_ENCUESTA.filter((option) => option.categoria === category).map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => selectSurveyOption(option)}
                        className={`group relative isolate flex min-h-32 items-center gap-4 overflow-hidden rounded-lg border border-white/20 ${option.colorBg} px-5 py-7 text-left text-white shadow-md transition hover:border-white/70 hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-white`}
                      >
                        <span className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
                          {option.imagenFondo && (
                            <Image
                              src={option.imagenFondo}
                              alt=""
                              fill
                              sizes="(max-width: 640px) 100vw, 50vw"
                              className="object-cover opacity-30"
                            />
                          )}
                          <span className="absolute inset-0 bg-slate-950/35" />
                        </span>
                        <span className="relative z-10 flex w-full items-center gap-4">
                          <span className="shrink-0 text-3xl" aria-hidden="true">{option.icono}</span>
                          <span className="flex-1 text-lg font-bold leading-snug text-white sm:text-xl">{option.texto}</span>
                          <ArrowRight aria-hidden="true" size={22} className="shrink-0 text-white" />
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <article className="relative isolate overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
              <div className="absolute inset-0 -z-10">
                <FallbackImage
                  key={selectedSurveyOption.id}
                  src={surveyResponse?.imagenFondo ?? '/images/aifa-terminal.jpg'}
                  fallback="/images/aifa-terminal.jpg"
                  alt=""
                  sizes="(max-width: 1024px) 100vw, 960px"
                  className="object-cover opacity-20"
                  fill
                />
              </div>
              <div className="relative p-5 sm:p-8">
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
                  <p className="mt-5 whitespace-pre-wrap border-l-2 border-emerald-300 bg-slate-950/60 px-4 py-3 text-sm leading-relaxed text-slate-100">
                    {surveyDetails}
                  </p>
                )}
                {!surveyFinished && (
                  <>
                    <p className="mt-6 border-l-2 border-emerald-300 pl-3 text-sm font-semibold text-emerald-100">{selectedSurveyOption.texto}</p>
                    <label htmlFor="survey-details" className="mt-6 block text-sm font-semibold text-white">{surveyResponse?.placeholderTexto}</label>
                    <textarea
                      id="survey-details"
                      value={surveyDetails}
                      onChange={(event) => setSurveyDetails(event.target.value)}
                      rows={4}
                      maxLength={500}
                      className="mt-2 w-full resize-y border border-white/20 bg-slate-950/80 p-3 text-sm leading-relaxed text-white placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      <MessageCircle aria-hidden="true" size={14} className="mr-1 inline" />
                      Este directorio no envía reportes; para atención inmediata, acércate al personal TIA.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSurveyFinished(true)}
                      className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 bg-emerald-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      Finalizar <ArrowRight aria-hidden="true" size={18} />
                    </button>
                  </>
                )}
                {surveyFinished && (
                  <button
                    type="button"
                    onClick={returnToMenu}
                    className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 border border-white/30 bg-slate-950/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  >
                    Volver al Menú Principal <ArrowRight aria-hidden="true" size={18} />
                  </button>
                )}
              </div>
            </article>
          )}
        </section>
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
