export type LocationCategory = 'puerta' | 'bano' | 'restaurante' | 'servicio';

export interface Location {
  id: string;
  name: string;
  level: string;
  zone: string;
  category: LocationCategory;
}

export interface RouteStep {
  step: number;
  instruction: string;
}

export interface NavigationRoute {
  originId: string;
  destinationId: string;
  estimatedMinutes: number;
  steps: RouteStep[];
}