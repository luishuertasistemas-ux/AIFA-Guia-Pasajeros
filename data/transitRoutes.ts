export type TransitStation = {
  id: string;
  name: string;
};

export type TransitRoute = {
  id: 'mexibus' | 'suburban';
  stations: TransitStation[];
  frequencyMinutes: string;
  travelTimeMinutes: string;
};

export const transitRoutes: TransitRoute[] = [
  {
    id: 'mexibus',
    frequencyMinutes: '5–10',
    travelTimeMinutes: '25–35',
    stations: [
      { id: 'ojo-de-agua', name: 'Ojo de Agua' },
      { id: 'loma-bonita', name: 'Loma Bonita' },
      { id: 'ozumbilla', name: 'Ozumbilla' },
      { id: 'san-francisco', name: 'San Francisco' },
      { id: 'quetzalcoatl', name: 'Quetzalcóatl' },
      { id: 'tecamac', name: 'Tecámac' },
      { id: 'la-redonda', name: 'La Redonda' },
      { id: 'glorieta-militar', name: 'Glorieta Militar' },
      { id: 'combustibles', name: 'Combustibles' },
      { id: 'hacienda', name: 'Hacienda' },
      { id: 'torre-de-control', name: 'Torre de Control' },
      { id: 'terminal-pasajeros-aifa', name: 'Terminal de Pasajeros / AIFA' }
    ]
  },
  {
    id: 'suburban',
    frequencyMinutes: '5–10',
    travelTimeMinutes: '50-60',
    stations: [
      { id: 'buenavista', name: 'Buenavista' },
      { id: 'fortuna', name: 'Fortuna' },
      { id: 'tlalnepantla', name: 'Tlalnepantla' },
      { id: 'san-rafael', name: 'San Rafael' },
      { id: 'lecheria', name: 'Lechería' },
      { id: 'cueyamil', name: 'Cueyamil' },
      { id: 'la-loma', name: 'La Loma' },
      { id: 'teyahualco', name: 'Teyahualco' },
      { id: 'prados-sur', name: 'Prados Sur' },
      { id: 'cajiga', name: 'Cajiga' },
      { id: 'xaltocan', name: 'Xaltocan' },
      { id: 'clara-krause-aifa', name: 'Clara Krause / AIFA' }
    ]
  }
];

export const MEXIBUS_FARES = {
  singleRideMxn: 10,
  cardIncludingRideMxn: 25,
  freeTransferStationId: 'ojo-de-agua'
} as const;
