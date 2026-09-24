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

function padTimePart(value: number): string {
  return String(value).padStart(2, '0');
}

export function getDefaultFlightTimeFields(now: Date = new Date()): FlightTimeFields {
  return {
    flightDate: `${now.getFullYear()}-${padTimePart(now.getMonth() + 1)}-${padTimePart(now.getDate())}`,
    boardingTime: `${padTimePart(now.getHours())}:${padTimePart(now.getMinutes())}`
  };
}

export function combineFlightDateTime({ flightDate, boardingTime }: FlightTimeFields): Date | null {
  if (!flightDate || !boardingTime) return null;

  const date = new Date(`${flightDate}T${boardingTime}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function validateFlightTimeFields(fields: FlightTimeFields, now: Date = new Date()): FlightTimeValidation {
  const errors: FlightTimeValidation = {};
  if (!fields.flightDate) errors.flightDate = 'Selecciona el día de tu vuelo.';
  if (!fields.boardingTime) errors.boardingTime = 'Indica la hora de abordaje o cierre de puerta.';

  const date = combineFlightDateTime(fields);
  if (fields.flightDate && !date) errors.flightDate = 'La fecha seleccionada no es válida.';
  if (fields.boardingTime && !date) errors.boardingTime = 'La hora seleccionada no es válida.';
  if (date && date.getTime() < new Date(now).setSeconds(0, 0)) {
    if (fields.flightDate === getDefaultFlightTimeFields(now).flightDate) {
      errors.boardingTime = 'La hora seleccionada ya pasó. Indica una hora futura.';
    } else {
      errors.flightDate = 'La fecha seleccionada ya pasó. Selecciona una fecha futura.';
    }
  }
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