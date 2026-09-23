import { calculateTimeStatus, type TimeCalculation, type TimeStatus } from '../../data/timeCalculator';

export type FlightTimeFields = {
  flightDate: string;
  boardingTime: string;
};

export type FlightTimeValidation = {
  flightDate?: string;
  boardingTime?: string;
  gate?: string;
};

export type FlightTimeResult = TimeCalculation & {
  status: TimeStatus;
};

export function combineFlightDateTime({ flightDate, boardingTime }: FlightTimeFields): Date | null {
  if (!flightDate || !boardingTime) return null;

  const date = new Date(`${flightDate}T${boardingTime}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function validateFlightTimeFields(fields: FlightTimeFields): FlightTimeValidation {
  const errors: FlightTimeValidation = {};
  if (!fields.flightDate) errors.flightDate = 'Selecciona el día de tu vuelo.';
  if (!fields.boardingTime) errors.boardingTime = 'Indica la hora de abordaje o cierre de puerta.';

  const date = combineFlightDateTime(fields);
  if (fields.flightDate && !date) errors.flightDate = 'La fecha seleccionada no es válida.';
  if (fields.boardingTime && !date) errors.boardingTime = 'La hora seleccionada no es válida.';
  return errors;
}

export function calculateFlightTime(
  fields: FlightTimeFields,
  estimatedWalkMinutes: number,
  now: Date,
): FlightTimeResult | null {
  const boardingDate = combineFlightDateTime(fields);
  if (!boardingDate) return null;
  return calculateTimeStatus(boardingDate, estimatedWalkMinutes, now);
}