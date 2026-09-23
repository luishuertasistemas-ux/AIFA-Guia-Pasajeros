export type TimeStatus = 'verde' | 'amarillo' | 'rojo' | 'error';

export interface TimeCalculation {
  status: TimeStatus;
  remainingMinutes: number;
  message: string;
}

export function calculateTimeStatus(
  boardingTime: string | Date,
  estimatedWalkMinutes: number,
  now: Date = new Date(),
): TimeCalculation {
  const boardingDate = new Date(boardingTime);

  if (Number.isNaN(boardingDate.getTime())) {
    throw new RangeError('boardingTime debe ser una fecha válida.');
  }

  if (!Number.isFinite(estimatedWalkMinutes) || estimatedWalkMinutes < 0) {
    throw new RangeError('estimatedWalkMinutes debe ser un número no negativo.');
  }

  const minutesUntilBoarding = Math.floor(
    (boardingDate.getTime() - now.getTime()) / 60000,
  );

  if (minutesUntilBoarding < 0) {
    return {
      status: 'error',
      remainingMinutes: minutesUntilBoarding - estimatedWalkMinutes,
      message: 'El horario seleccionado ya pasó. Selecciona una fecha y hora futuras.',
    };
  }

  const remainingMinutes = minutesUntilBoarding - estimatedWalkMinutes;

  if (remainingMinutes <= 0) {
    return {
      status: 'rojo',
      remainingMinutes,
      message: 'El tiempo estimado puede ser insuficiente. Dirígete directamente a tu puerta y considera los procesos pendientes.',
    };
  }

  if (remainingMinutes > 20) {
    return {
      status: 'verde',
      remainingMinutes,
      message: 'Según la estimación, tienes un margen de tiempo disponible para llegar a tu puerta.',
    };
  }

  if (remainingMinutes >= 5) {
    return {
      status: 'amarillo',
      remainingMinutes,
      message: 'Tu margen de tiempo es limitado. Prioriza tu recorrido hacia la puerta de abordaje.',
    };
  }

  return {
    status: 'rojo',
    remainingMinutes,
    message: 'El tiempo estimado puede ser insuficiente. Dirígete directamente a tu puerta y considera los procesos pendientes.',
  };
}