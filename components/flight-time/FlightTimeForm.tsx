import type { FormEvent } from 'react';
import { BOARDING_GATES } from '../../data/locations';
import type { FlightTimeFields, FlightTimeValidation } from './flightTimeUtils';
import { useLanguage } from '@/LanguageContext';
import { translations } from '@/data/translations';

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
  const { language } = useLanguage();
  const copy = translations[language].flightTime;
  return (
    <form onSubmit={onSubmit} className="mt-5 border-t border-white/15 pt-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-100">
          {copy.date}
          <span className="mt-1 block text-xs font-normal text-slate-300">{copy.selectDate}</span>
          <input
            type="date"
            value={fields.flightDate}
            onChange={(event) => onFieldsChange({ ...fields, flightDate: event.target.value })}
            aria-invalid={Boolean(errors.flightDate)}
            className="mt-2 block min-h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
          />
          <FieldError message={errors.flightDate ? copy.errors.flightDate : undefined} />
        </label>

        <label className="text-sm font-semibold text-slate-100">
          {copy.referenceTime}
          <span className="mt-1 block text-xs font-normal text-slate-300">{copy.boardingClose}</span>
          <input
            type="time"
            value={fields.boardingTime}
            onChange={(event) => onFieldsChange({ ...fields, boardingTime: event.target.value })}
            aria-invalid={Boolean(errors.boardingTime)}
            className="mt-2 block min-h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
          />
          <FieldError message={errors.boardingTime ? copy.errors.boardingTime : undefined} />
        </label>

        <label className="text-sm font-semibold text-slate-100 sm:col-span-2">
          {copy.gate}
          <span className="mt-1 block text-xs font-normal text-slate-300">{copy.selectGate}</span>
          <select
            value={selectedGateId}
            onChange={(event) => onGateChange(event.target.value)}
            aria-invalid={Boolean(errors.gate)}
            className="mt-2 block min-h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
          >
            <option value="" className="bg-slate-900 text-white">{copy.selectGateOption}</option>
            {BOARDING_GATES.map((gateId) => (
              <option key={gateId} value={gateId} className="bg-slate-900 text-white">{copy.gate} {gateId.replace('puerta-', '')}</option>
            ))}
          </select>
          <FieldError message={errors.gate ? copy.errors.gate : undefined} />
        </label>
      </div>

      <button type="submit" className="mt-5 min-h-11 rounded-xl bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.35)] transition hover:bg-sky-300 hover:shadow-[0_0_24px_rgba(56,189,248,0.55)] focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900">
        {copy.calculate}
      </button>
    </form>
  );
}