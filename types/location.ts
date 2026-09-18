export type LocationCategory = 'puertas' | 'servicios' | 'comida' | 'turismo';
export type SupportedLanguage = 'ES' | 'EN' | 'FR' | 'ZH';

export interface LocationTranslation {
  title: string;
  description: string;
}

export interface Location {
  id: string;
  category: LocationCategory;
  translations: Record<SupportedLanguage, LocationTranslation>;
  walkTime: string;
  images: string[];
  mapZone: string;
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