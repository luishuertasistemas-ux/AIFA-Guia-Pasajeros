import type { FormEvent } from 'react';
import { BOARDING_GATES } from '../../data/locations';
import type { FlightTimeFields, FlightTimeValidation } from './flightTimeUtils';

type FlightTimeFormProps = {
  fields: FlightTimeFields;
  selectedGateId: string;
  errors: FlightTimeValidation;
  onFieldsChange: (fields: FlightTimeFields) => void;
  onGateChange: (gateId: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs font-semibold text-rose-200">{message}</p> : null;
}

export function FlightTimeForm({ fields, selectedGateId, errors, onFieldsChange, onGateChange, onSubmit }: FlightTimeFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-5 border-t border-white/15 pt-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-100">
          Fecha del vuelo
          <span className="mt-1 block text-xs font-normal text-slate-300">Selecciona el día de tu vuelo.</span>
          <input
            type="date"
            value={fields.flightDate}
            onChange={(event) => onFieldsChange({ ...fields, flightDate: event.target.value })}
            aria-invalid={Boolean(errors.flightDate)}
            className="mt-2 block min-h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
          />
          <FieldError message={errors.flightDate} />
        </label>

        <label className="text-sm font-semibold text-slate-100">
          Hora de referencia
          <span className="mt-1 block text-xs font-normal text-slate-300">Abordaje o cierre de la puerta.</span>
          <input
            type="time"
            value={fields.boardingTime}
            onChange={(event) => onFieldsChange({ ...fields, boardingTime: event.target.value })}
            aria-invalid={Boolean(errors.boardingTime)}
            className="mt-2 block min-h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
          />
          <FieldError message={errors.boardingTime} />
        </label>

        <label className="text-sm font-semibold text-slate-100 sm:col-span-2">
          Puerta de abordaje
          <span className="mt-1 block text-xs font-normal text-slate-300">Selecciona la puerta que aparece en tu pase de abordar.</span>
          <select
            value={selectedGateId}
            onChange={(event) => onGateChange(event.target.value)}
            aria-invalid={Boolean(errors.gate)}
            className="mt-2 block min-h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
          >
            <option value="" className="bg-slate-900 text-white">Selecciona una puerta</option>
            {BOARDING_GATES.map((gateId) => (
              <option key={gateId} value={gateId} className="bg-slate-900 text-white">Puerta {gateId.replace('puerta-', '')}</option>
            ))}
          </select>
          <FieldError message={errors.gate} />
        </label>
      </div>

      <button type="submit" className="mt-5 min-h-11 rounded-xl bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.35)] transition hover:bg-sky-300 hover:shadow-[0_0_24px_rgba(56,189,248,0.55)] focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900">
        Calcular mi tiempo
      </button>
    </form>
  );
}