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
      { id: 'tecamac-centro', name: 'Tecámac Centro' },
      { id: 'heroes-de-tecamac', name: 'Héroes de Tecámac' },
      { id: 'glorieta-militar', name: 'Glorieta Militar' },
      { id: 'lomas-de-san-francisco', name: 'Lomas de San Francisco' },
      { id: 'san-pedro-pozohuacan', name: 'San Pedro Pozohuacan' },
      { id: 'terminal-aifa', name: 'Terminal AIFA' }
    ]
  },
  {
    id: 'suburban',
    frequencyMinutes: '5–10',
    travelTimeMinutes: '35–45',
    stations: [
      { id: 'lecheria', name: 'Lechería' },
      { id: 'cueyamil', name: 'Cueyamil' },
      { id: 'los-agaves', name: 'Los Agaves' },
      { id: 'teyahualco', name: 'Teyahualco' },
      { id: 'prados-sur', name: 'Prados Sur' },
      { id: 'nextlalpan', name: 'Nextlalpan' },
      { id: 'xaltocan', name: 'Xaltocan' },
      { id: 'aifa', name: 'AIFA' }
    ]
  }
];

export const MEXIBUS_FARES = {
  singleRideMxn: 10,
  cardIncludingRideMxn: 25,
  freeTransferStationId: 'ojo-de-agua'
} as const;
