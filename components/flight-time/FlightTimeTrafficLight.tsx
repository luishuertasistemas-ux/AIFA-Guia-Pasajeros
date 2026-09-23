import type { TimeStatus } from '../../data/timeCalculator';

type FlightTimeTrafficLightProps = {
  status: TimeStatus | null;
};

const STATUS_CONFIG: Record<TimeStatus, { label: string; icon: string; classes: string }> = {
  verde: { label: 'Verde', icon: '✓', classes: 'border-emerald-300/60 bg-emerald-500/20 text-emerald-100' },
  amarillo: { label: 'Amarillo', icon: '!', classes: 'border-amber-300/70 bg-amber-400/20 text-amber-100' },
  rojo: { label: 'Rojo', icon: '!', classes: 'border-red-300/70 bg-red-500/20 text-red-100' },
  error: { label: 'Error', icon: '⚠', classes: 'border-rose-300/70 bg-rose-900/50 text-rose-100' }
};

export function FlightTimeTrafficLight({ status }: FlightTimeTrafficLightProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Estado del tiempo disponible">
      {(Object.keys(STATUS_CONFIG) as TimeStatus[]).map((statusKey) => {
        const config = STATUS_CONFIG[statusKey];
        const isActive = status === statusKey;
        return (
          <span
            key={statusKey}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide transition ${config.classes} ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : 'opacity-60'}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <span aria-hidden="true">{config.icon}</span>
            {config.label}
          </span>
        );
      })}
    </div>
  );
}