import type { Location, NavigationRoute } from '../../types/location';
import type { TimeCalculation } from '../../data/timeCalculator';
import { useLanguage } from '@/LanguageContext';
import { translations } from '@/data/translations';

type FlightTimeResultProps = {
  origin: Location;
  gate: Location | undefined;
  boardingTime: string;
  estimatedWalkMinutes: number;
  calculation: TimeCalculation;
  route: NavigationRoute | undefined;
};

export function FlightTimeResult({ origin, gate, boardingTime, estimatedWalkMinutes, calculation, route }: FlightTimeResultProps) {
  const { language } = useLanguage();
  const copy = translations[language].flightTime.result;
  const isError = calculation.status === 'error';
  return (
    <div className={`mt-5 rounded-2xl border p-4 transition sm:p-5 ${isError ? 'border-rose-300/70 bg-rose-950/50' : calculation.status === 'rojo' ? 'border-red-300/70 bg-red-950/40' : calculation.status === 'amarillo' ? 'border-amber-300/70 bg-amber-950/30' : 'border-emerald-300/70 bg-emerald-950/30'}`}>
      <p className="text-sm font-semibold text-white">
        {copy.at} <span className="text-amber-300">{origin.translations[language].title}</span> {copy.destination} <span className="text-amber-300">{gate?.translations[language].title || copy.selectedGate}</span>.
      </p>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div><span className="block text-xs text-slate-300">{translations[language].flightTime.referenceTime}</span><strong className="text-white">{boardingTime}</strong></div>
        <div><span className="block text-xs text-slate-300">{copy.walking}</span><strong className="text-amber-300">{estimatedWalkMinutes} {copy.minutes}</strong></div>
        <div><span className="block text-xs text-slate-300">{copy.available}</span><strong className="text-white">{isError ? copy.noData : `${calculation.remainingMinutes} ${copy.minutes}`}</strong></div>
      </div>
      <p className="mt-4 text-sm font-semibold text-white" role="status" aria-live="polite">{copy.statuses[calculation.status]}</p>
      {route && (
        <p className="mt-3 text-xs text-slate-200">{copy.route} {route.stepTranslations[language].join(' → ')}</p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-slate-300">{copy.estimate}</p>
    </div>
  );
}