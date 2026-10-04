export type LocationCategory = 'puertas' | 'servicios' | 'comida' | 'turismo';
export type SupportedLanguage = 'ES' | 'EN' | 'FR' | 'ZH';
export type LocationMapZone =
  | 'Nivel 1 - Zona Principal'
  | 'Nivel 2 - Concourse Central'
  | 'Nivel 1 - Concourse Central'
  | 'Nivel 1 - Zona Comercial'
  | 'Nivel 2 - Concourse Norte'
  | 'Nivel 2 - Concourse Sur'
  | 'Nivel 1 - Zona Cultural'
  | 'Nivel 1 - Zona de Hangares'
  | 'Nivel 1 - Zona Histórica';

export interface LocationTranslation {
  title: string;
  description: string;
}

export interface Location {
  id: string;
  isPassengerAccessible: boolean;
  category: LocationCategory;
  translations: Record<SupportedLanguage, LocationTranslation>;
  walkTimeMinutes: number;
  images: string[];
  mapZone: LocationMapZone;
  quickTip?: Partial<Record<SupportedLanguage, string>>;
  curiosity?: Partial<Record<SupportedLanguage, string>>;
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
  stepTranslations: Record<SupportedLanguage, string[]>;
}