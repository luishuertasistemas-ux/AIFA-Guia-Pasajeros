'use client';

import { useState, type FormEvent } from 'react';
import type { Location, NavigationRoute } from '../../types/location';
import type { TimeCalculation, TimeStatus } from '../../data/timeCalculator';
import { getEstimatedWalkingMinutes, MOCK_LOCATIONS, MOCK_ROUTES } from '../../data/locations';
import { FlightTimeForm } from './FlightTimeForm';
import { FlightTimeResult } from './FlightTimeResult';
import { FlightTimeTrafficLight } from './FlightTimeTrafficLight';
import { calculateFlightTime, type FlightTimeFields, type FlightTimeValidation, validateFlightTimeFields } from './flightTimeUtils';

type FlightTimeModuleProps = {
  currentTime: Date | null;
  origin: Location;
};

export function FlightTimeModule({ currentTime, origin }: FlightTimeModuleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState<FlightTimeFields>({ flightDate: '', boardingTime: '' });
  const [selectedGateId, setSelectedGateId] = useState('');
  const [errors, setErrors] = useState<FlightTimeValidation>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const gate = selectedGateId ? MOCK_LOCATIONS[selectedGateId] : undefined;
  const estimatedWalkMinutes = selectedGateId ? getEstimatedWalkingMinutes(origin.id, selectedGateId) : 0;
  const route: NavigationRoute | undefined = selectedGateId ? MOCK_ROUTES[`${origin.id}-${selectedGateId}`] : undefined;
  const calculation: TimeCalculation | null = hasSubmitted && currentTime && selectedGateId
    ? calculateFlightTime(fields, estimatedWalkMinutes, currentTime)
    : null;
  const currentStatus: TimeStatus | null = calculation?.status || null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateFlightTimeFields(fields);
    if (!selectedGateId) nextErrors.gate = 'Selecciona una puerta de abordaje.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || !currentTime || !selectedGateId) {
      setHasSubmitted(false);
      return;
    }
    setHasSubmitted(true);
  };

  const handleFieldsChange = (nextFields: FlightTimeFields) => {
    setFields(nextFields);
    setHasSubmitted(false);
    setErrors({});
  };

  return (
    <section className="relative mx-5 mt-5 overflow-hidden rounded-2xl bg-cover bg-center text-white shadow-lg sm:mx-8" style={{ backgroundImage: 'url("/images/hero-aifa-semaphor.jpg")' }} aria-labelledby="flight-time-title">
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="relative p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Modo Serenidad</p>
            <h2 id="flight-time-title" className="mt-1 text-xl font-bold text-white sm:text-2xl">¿Me da tiempo para mi vuelo?</h2>
            <p className="mt-1 max-w-xl text-sm text-slate-200">Calcula tu margen real desde tu ubicación actual hasta la puerta de abordaje.</p>
          </div>
          <FlightTimeTrafficLight status={currentStatus} />
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-white/15 bg-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-white">Voy a viajar</p>
            <p className="mt-1 text-xs text-slate-300">Indica tu vuelo para recibir una orientación personalizada.</p>
          </div>
          <button type="button" onClick={() => setIsOpen((open) => !open)} className="min-h-11 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900">
            {isOpen ? 'Cerrar' : 'Abrir formulario'}
          </button>
        </div>

        {isOpen && (
          <FlightTimeForm fields={fields} selectedGateId={selectedGateId} errors={errors} onFieldsChange={handleFieldsChange} onGateChange={(gateId) => { setSelectedGateId(gateId); setHasSubmitted(false); setErrors({}); }} onSubmit={handleSubmit} />
        )}

        {calculation && (
          <FlightTimeResult origin={origin} gate={gate} boardingTime={`${fields.flightDate} ${fields.boardingTime}`} estimatedWalkMinutes={estimatedWalkMinutes} calculation={calculation} route={route} />
        )}
      </div>
    </section>
  );
}