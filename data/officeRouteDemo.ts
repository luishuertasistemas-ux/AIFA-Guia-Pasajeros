export type OfficeNodeId = 'oficina' | 'interseccion_pared' | 'ruta_servicios' | 'ruta_aodb';
export type MamutStartNodeId = 'oficina' | 'interseccion_pared' | 'sala_juntas';
export type OfficeDirection = 'straight' | 'left' | 'right';
export type OfficeDestinationId = 'servicios' | 'aodb';

export type OfficeRouteNode = {
  id: OfficeNodeId;
  name: string;
  landmark: string;
  connections: Partial<Record<OfficeDirection, OfficeNodeId>>;
};

export type OfficeRouteStep = {
  nodeId: OfficeNodeId;
  direction: OfficeDirection;
  title: string;
  instruction: string;
};

export const officeRouteNodes: Record<OfficeNodeId, OfficeRouteNode> = {
  oficina: {
    id: 'oficina',
    name: 'Oficina',
    landmark: 'Puerta de cristal y aluminio',
    connections: { straight: 'interseccion_pared' }
  },
  interseccion_pared: {
    id: 'interseccion_pared',
    name: 'Intersección del muro',
    landmark: 'Muro con botes de reciclaje y señal verde',
    connections: { left: 'ruta_servicios', right: 'ruta_aodb' }
  },
  ruta_servicios: {
    id: 'ruta_servicios',
    name: 'Ruta de servicios',
    landmark: 'Baños, Cocina/Comedor, Lockers y Almacén',
    connections: {}
  },
  ruta_aodb: {
    id: 'ruta_aodb',
    name: 'Ruta AODB',
    landmark: 'Salida de Emergencia y Salón del Curso AODB con Martín',
    connections: {}
  }
};

export const mamutStartNodes: Record<MamutStartNodeId, {
  name: string;
  landmark: string;
}> = {
  oficina: {
    name: 'Oficina',
    landmark: 'Puerta de cristal y aluminio'
  },
  interseccion_pared: {
    name: 'Intersección del muro',
    landmark: 'Muro con botes de reciclaje y señal verde'
  },
  sala_juntas: {
    name: 'Sala de Juntas',
    landmark: 'Salón del Curso AODB con Martín'
  }
};

export const officeRouteDestinations: Record<OfficeDestinationId, {
  label: string;
  steps: OfficeRouteStep[];
}> = {
  servicios: {
    label: 'Servicios (Baños / Comedor)',
    steps: [
      {
        nodeId: 'oficina',
        direction: 'straight',
        title: 'Sal de la oficina',
        instruction: 'Al salir por la puerta de cristal y aluminio, avanza de frente hacia el muro.'
      },
      {
        nodeId: 'interseccion_pared',
        direction: 'left',
        title: 'Gira a la izquierda',
        instruction: 'Detente frente al muro con los botes de reciclaje y la señal verde. En este punto, gira a la izquierda para tomar la ruta de servicios.'
      },
      {
        nodeId: 'ruta_servicios',
        direction: 'straight',
        title: 'Continúa hacia los servicios',
        instruction: 'Sigue por esta ruta para llegar a los Baños, la Cocina/Comedor, los Lockers y el Almacén.'
      }
    ]
  },
  aodb: {
    label: 'Curso AODB (Martín) / Salida de Emergencia',
    steps: [
      {
        nodeId: 'oficina',
        direction: 'straight',
        title: 'Sal de la oficina',
        instruction: 'Al salir por la puerta de cristal y aluminio, avanza de frente hacia el muro.'
      },
      {
        nodeId: 'interseccion_pared',
        direction: 'right',
        title: 'Gira a la derecha',
        instruction: 'Detente frente al muro con los botes de reciclaje y la señal verde. En este punto, gira a la derecha para tomar la ruta AODB.'
      },
      {
        nodeId: 'ruta_aodb',
        direction: 'straight',
        title: 'Continúa hacia la ruta AODB',
        instruction: 'Sigue por esta ruta para encontrar la Salida de Emergencia y el Salón del Curso AODB, donde está Martín.'
      }
    ]
  }
};
