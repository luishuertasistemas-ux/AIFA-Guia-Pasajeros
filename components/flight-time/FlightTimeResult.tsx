import type { Location, NavigationRoute } from '../../types/location';
import type { TimeCalculation } from '../../data/timeCalculator';

type FlightTimeResultProps = {
  origin: Location;
  gate: Location | undefined;
  boardingTime: string;
  estimatedWalkMinutes: number;
  calculation: TimeCalculation;
  route: NavigationRoute | undefined;
};

export function FlightTimeResult({ origin, gate, boardingTime, estimatedWalkMinutes, calculation, route }: FlightTimeResultProps) {
  const isError = calculation.status === 'error';
  return (
    <div className={`mt-5 rounded-2xl border p-4 transition sm:p-5 ${isError ? 'border-rose-300/70 bg-rose-950/50' : calculation.status === 'rojo' ? 'border-red-300/70 bg-red-950/40' : calculation.status === 'amarillo' ? 'border-amber-300/70 bg-amber-950/30' : 'border-emerald-300/70 bg-emerald-950/30'}`}>
      <p className="text-sm font-semibold text-white">
        Estás en <span className="text-amber-300">{origin.translations.ES.title}</span> y tu destino es <span className="text-amber-300">{gate?.translations.ES.title || 'la puerta seleccionada'}</span>.
      </p>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div><span className="block text-xs text-slate-300">Hora de referencia</span><strong className="text-white">{boardingTime}</strong></div>
        <div><span className="block text-xs text-slate-300">Caminata estimada</span><strong className="text-amber-300">{estimatedWalkMinutes} min</strong></div>
        <div><span className="block text-xs text-slate-300">Tiempo disponible</span><strong className="text-white">{isError ? 'No disponible' : `${calculation.remainingMinutes} min`}</strong></div>
      </div>
      <p className="mt-4 text-sm font-semibold text-white" role="status" aria-live="polite">{calculation.message}</p>
      {route && (
        <p className="mt-3 text-xs text-slate-200">Ruta configurada: {route.steps.map((step) => step.instruction).join(' → ')}</p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-slate-300">Es una estimación. Puede variar por documentación, filas de seguridad, señalización, ascensores, escaleras y condiciones operativas del aeropuerto.</p>
    </div>
  );
}