'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  Clock3,
  ExternalLink,
  Landmark,
  Luggage,
  PawPrint,
  Plane,
  TrainFront,
  UsersRound,
  type LucideIcon
} from 'lucide-react';

type Screen = 'welcome' | 'hub' | 'role';
type RoleId = 'arrival' | 'departure' | 'pickup' | 'tourism' | 'transport' | 'lost-items' | 'pets';
type RoleInfo = {
  id: RoleId;
  title: string;
  subtitle: string;
  description: string;
  steps: string[];
  icon: LucideIcon;
};
type TimeTheme = { label: string; image: string };

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
const MAIN_ROLE_CARD_STYLES: Record<MainRoleId, string> = {
  arrival: 'from-emerald-600 to-teal-700 hover:from-emerald-500 shadow-emerald-500/20',
  departure: 'from-blue-600 to-indigo-700 hover:from-blue-500 shadow-blue-500/20',
  pickup: 'from-amber-500 to-orange-600 hover:from-amber-400 shadow-amber-500/20',
  tourism: 'from-fuchsia-600 to-purple-700 hover:from-fuchsia-500 shadow-fuchsia-500/20'
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

export default function Home() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
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

  const openRole = (roleId: RoleId) => {
    setSelectedRole(roleId);
    setScreen('role');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const returnToMenu = () => {
    setSelectedRole(null);
    setScreen('hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeRole = selectedRole ? ROLE_INFO[selectedRole] : null;
  const ActiveRoleIcon = activeRole?.icon;
  const timeTheme = getTimeTheme(currentTime);

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
              disabled={isWelcomeFading}
              onClick={() => setIsWelcomeFading(true)}
              className="mt-8 inline-flex min-h-[56px] items-center justify-center gap-3 rounded-xl bg-emerald-400 px-7 py-3 text-base font-bold text-slate-950 shadow-xl shadow-emerald-950/40 transition hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-white/70 disabled:cursor-default"
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
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-6 pt-8 sm:px-8 sm:pt-12">
            <header className="mb-7 sm:mb-9">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">AIFA · Guía de pasajeros</p>
              <h1 className="mt-2 max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">¿Cómo podemos ayudarte hoy?</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">Elige lo que necesitas y te orientamos en tu visita.</p>
            </header>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {MAIN_ROLE_IDS.map((roleId) => {
                const role = ROLE_INFO[roleId];
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => openRole(role.id)}
                    className={`group flex min-h-32 items-center gap-4 rounded-2xl border border-white/20 bg-gradient-to-br ${MAIN_ROLE_CARD_STYLES[role.id]} p-4 text-left text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-white sm:min-h-36 sm:p-5`}
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white transition-colors group-hover:bg-white/30">
                      <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xl font-bold leading-snug text-white md:text-2xl">{role.title}</span>
                      <span className="mt-1 block text-sm font-medium leading-relaxed text-white/90 md:text-base">{role.subtitle}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="shrink-0 text-white/75 transition group-hover:translate-x-1 group-hover:text-white" size={20} />
                  </button>
                );
              })}
            </div>

            <nav aria-label="Ayuda rápida" className="mt-auto pt-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-300">Ayuda rápida</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {SUPPORT_ROLE_IDS.map((roleId) => {
                  const role = ROLE_INFO[roleId];
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => openRole(role.id)}
                      className="flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl border border-white/15 bg-slate-900/75 px-2 py-3 text-center text-xs font-semibold text-white transition hover:border-emerald-300/70 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 sm:min-h-20 sm:flex-row sm:text-sm"
                    >
                      <Icon aria-hidden="true" size={20} className="shrink-0 text-emerald-200" />
                      <span>{role.title}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </section>
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
              <ol className="mt-7 space-y-3">
                {activeRole.steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-sm font-bold text-slate-950">{index + 1}</span>
                    <span className="pt-0.5 text-sm leading-relaxed text-slate-100">{step}</span>
                  </li>
                ))}
              </ol>
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
