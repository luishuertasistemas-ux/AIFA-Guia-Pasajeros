'use client';

import { useState, useEffect } from 'react';
import VideoReceptionConsole from '@/components/VideoReceptionConsole';
import { translations } from '@/data/translations';
import { useLanguage } from '@/LanguageContext';

export default function GestorPage() {
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // Verificar si ya inició sesión anteriormente en esta sesión de navegador
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('aifa_gestor_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // PIN de acceso por defecto (puedes cambiarlo aquí)
    if (pin === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('aifa_gestor_auth', 'true');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aifa_gestor_auth');
    setIsAuthenticated(false);
    setPin('');
  };

  // Si no está autenticado, muestra la pantalla de PIN de seguridad
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              🛡️
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Consola del Gestor AIFA
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Ingresa el PIN de seguridad para acceder al panel operativo
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                PIN de Acceso
              </label>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="••••"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-2xl font-mono tracking-widest text-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors"
                autoFocus
              />
              {error && (
                <p className="text-xs text-rose-400 mt-2 text-center font-medium">
                  ⚠️ PIN incorrecto. Intenta de nuevo.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-950/50 active:scale-[0.98]"
            >
              Ingresar a la Consola
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Acceso restringido únicamente a personal autorizado del AIFA.
          </p>
        </div>
      </div>
    );
  }

  // Si está autenticado, muestra la consola con botón de cierre de sesión
  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Botón flotante para cerrar sesión */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 px-3 py-1.5 bg-slate-900/80 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-800/50 text-slate-300 hover:text-rose-300 text-xs rounded-lg backdrop-blur-sm transition-all"
        title="Cerrar Sesión del Gestor"
      >
        🔒 Salir del Gestor
      </button>

      <VideoReceptionConsole copy={translations[language].videoCall} />
    </div>
  );
}