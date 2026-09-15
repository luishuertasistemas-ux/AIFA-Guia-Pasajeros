export type Category = 'puerta' | 'bano' | 'restaurante' | 'servicio' | 'transporte';

export interface Location {
  id: string;            // Identificador único (ej. 'entrada-principal')
  name: string;          // Nombre para mostrar al usuario (ej. 'Entrada Principal - Acceso A')
  category: Category;    // Categoría para filtrar
  terminal: string;      // Ej. 'Terminal de Pasajeros'
  level: number;         // Piso / Nivel
  zone: string;          // Ej. 'Norte', 'Sur', 'Centro'
  description?: string;  // Indicación o referencia visual útil
}

export interface RouteInstruction {
  step: number;
  instruction: string;
  distanceMeters: number;
}

export interface NavigationRoute {
  originId: string;
  destinationId: string;
  estimatedMinutes: number;
  steps: RouteInstruction[];
}