'use client';

import Image from 'next/image';
import { useState, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AirportNode {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
  neighbors: string[];
}

const MAP_WIDTH = 1024;
const MAP_HEIGHT = 576;

const INITIAL_NODES: AirportNode[] = [
  { id: 'llegadas-n1', name: 'Sala de Llegadas N1', x: 290, y: 385, description: 'Área de bandas de equipaje y aduana.', neighbors: ['filtros-abordaje', 'corredor-central'] },
  { id: 'filtros-abordaje', name: 'Filtros de Abordaje & Salas', x: 405, y: 330, description: 'Control de seguridad y accesos a salas.', neighbors: ['llegadas-n1', 'corredor-central'] },
  { id: 'corredor-central', name: 'Corredor Central Principal', x: 510, y: 285, description: 'Eje principal de conexión del aeropuerto.', neighbors: ['llegadas-n1', 'filtros-abordaje', 'tren-aifa'] },
  { id: 'tren-aifa', name: 'Estación Tren Felipe Ángeles', x: 545, y: 455, description: 'Terminal de transporte suburbano.', neighbors: ['corredor-central'] }
];

const UNIQUE_NODES = Array.from(
  new Map(INITIAL_NODES.map((node) => [node.id, node])).values()
);

function findRoute(startId: string, destinationId: string): AirportNode[] {
  const queue: string[][] = [[startId]];
  const visited = new Set([startId]);

  while (queue.length > 0) {
    const path = queue.shift();
    if (!path) continue;

    const lastNodeId = path[path.length - 1];
    if (lastNodeId === destinationId) {
      return path.flatMap((id) => {
        const node = UNIQUE_NODES.find((candidate) => candidate.id === id);
        return node ? [node] : [];
      });
    }

    const node = UNIQUE_NODES.find((candidate) => candidate.id === lastNodeId);
    for (const neighborId of node?.neighbors ?? []) {
      if (visited.has(neighborId) || !UNIQUE_NODES.some((candidate) => candidate.id === neighborId)) continue;
      visited.add(neighborId);
      queue.push([...path, neighborId]);
    }
  }

  return [];
}

function getNodeLabelPosition(node: AirportNode): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } {
  if (node.id === 'llegadas-n1') return { x: node.x - 14, y: node.y + 30, anchor: 'end' };
  if (node.id === 'tren-aifa') return { x: node.x + 14, y: node.y + 30, anchor: 'start' };
  return { x: node.x + 14, y: node.y - 14, anchor: 'start' };
}

export default function AirportIsometricMap() {
  const shouldReduceMotion = useReducedMotion();
  const [currentNodeId] = useState('llegadas-n1');
  const [destinationId, setDestinationId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const currentNode = UNIQUE_NODES.find((node) => node.id === currentNodeId);
  const targetNode = UNIQUE_NODES.find((node) => node.id === destinationId);
  const route = currentNode && targetNode ? findRoute(currentNode.id, targetNode.id) : [];
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredNodes = UNIQUE_NODES.filter((node) =>
    node.id !== currentNodeId && node.name.toLocaleLowerCase().includes(normalizedQuery)
  );

  const selectDestination = (node: AirportNode) => {
    setDestinationId(node.id);
    setSearchQuery(node.name);
    setIsSearchOpen(false);
  };

  const handleSuggestionKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const clearDestination = () => {
    setDestinationId('');
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const routePath = route.map((node, index) =>
    `${index === 0 ? 'M' : 'L'} ${node.x} ${node.y}`
  ).join(' ');

  return (
    <section className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-white shadow-2xl sm:p-6">
      <header className="relative z-50 mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold text-cyan-300">Guía interactiva del AIFA</h2>
          <p className="mt-1 text-sm text-slate-300">
            Punto actual:{' '}
            <span className="font-semibold text-amber-300">{currentNode?.name}</span>
          </p>
        </div>

        <div className="relative z-50 w-full md:w-80" onKeyDown={handleSuggestionKeyDown}>
          <label htmlFor="airport-destination-search" className="sr-only">Buscar destino en el mapa</label>
          <input
            id="airport-destination-search"
            type="search"
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isSearchOpen}
            aria-controls="airport-destination-options"
            placeholder="Buscar destino (ej. Tren, Filtros)..."
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setDestinationId('');
              setIsSearchOpen(true);
            }}
            className="relative z-50 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
          />

          {isSearchOpen && (
            <ul
              id="airport-destination-options"
              role="listbox"
              className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
            >
              {filteredNodes.length > 0 ? (
                filteredNodes.map((node) => (
                  <li key={node.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={node.id === destinationId}
                      onClick={() => selectDestination(node)}
                      className="min-h-11 w-full border-b border-slate-800 px-4 py-2.5 text-left text-sm transition-colors last:border-0 hover:bg-cyan-500/20 focus-visible:bg-cyan-500/20 focus-visible:outline-none"
                    >
                      {node.name}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-xs text-slate-400" role="status">
                  No se encontraron destinos
                </li>
              )}
            </ul>
          )}
        </div>
      </header>

      <div
        className="relative isolate aspect-video w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900"
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsSearchOpen(false);
        }}
      >
        <Image
          src="/images/aifa-mapa.png"
          alt="Mapa isométrico de las salas, llegadas, salidas y conexiones del AIFA"
          fill
          sizes="(max-width: 768px) 100vw, 1152px"
          className="object-cover"
          priority
        />
        <div aria-hidden="true" className="absolute inset-0 bg-slate-950/10" />

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          role="group"
          aria-label="Mapa interactivo con la ubicación actual y los destinos del aeropuerto"
        >
          {UNIQUE_NODES.flatMap((node) =>
            node.neighbors.flatMap((neighborId) => {
              const neighbor = UNIQUE_NODES.find((candidate) => candidate.id === neighborId);
              if (!neighbor || node.id.localeCompare(neighbor.id) >= 0) return [];
              return [
                <line
                  key={`${node.id}-${neighbor.id}`}
                  x1={node.x}
                  y1={node.y}
                  x2={neighbor.x}
                  y2={neighbor.y}
                  stroke="#0f172a"
                  strokeOpacity="0.65"
                  strokeWidth="8"
                  strokeLinecap="round"
                />,
                <line
                  key={`${node.id}-${neighbor.id}-guide`}
                  x1={node.x}
                  y1={node.y}
                  x2={neighbor.x}
                  y2={neighbor.y}
                  stroke="#bae6fd"
                  strokeOpacity="0.75"
                  strokeWidth="2"
                  strokeDasharray="5 8"
                  strokeLinecap="round"
                />
              ];
            })
          )}

          {routePath && (
            <>
              <motion.path
                key={destinationId}
                d={routePath}
                fill="none"
                stroke="#082f49"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0.6 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 1, ease: 'easeInOut' }}
              />
              <motion.path
                key={`${destinationId}-highlight`}
                d={routePath}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0.35 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 1, ease: 'easeInOut' }}
              />
            </>
          )}

          {UNIQUE_NODES.map((node) => {
            const isCurrent = node.id === currentNodeId;
            const isTarget = node.id === destinationId;
            const label = getNodeLabelPosition(node);

            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                aria-label={`${node.name}. ${node.description}${isCurrent ? ' Ubicación actual.' : ' Seleccionar como destino.'}`}
                aria-pressed={isTarget}
                className="cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
                onClick={() => {
                  if (!isCurrent) selectDestination(node);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    if (!isCurrent) selectDestination(node);
                  }
                }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isCurrent || isTarget ? 18 : 13}
                  fill="#020617"
                  fillOpacity="0.8"
                  stroke={isCurrent ? '#fbbf24' : isTarget ? '#22d3ee' : '#e2e8f0'}
                  strokeWidth="3"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isCurrent || isTarget ? 8 : 5}
                  fill={isCurrent ? '#fbbf24' : isTarget ? '#22d3ee' : '#e2e8f0'}
                />
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor={label.anchor}
                  fill="white"
                  stroke="#020617"
                  strokeWidth="5"
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  fontSize="14"
                  fontWeight="700"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>

        {targetNode && (
          <aside
            aria-live="polite"
            className="absolute bottom-2 right-2 z-20 flex w-[38%] max-w-xs flex-col items-start rounded-xl border border-cyan-300/35 bg-slate-950/75 p-2 shadow-xl backdrop-blur-md sm:bottom-4 sm:right-4 sm:p-3"
          >
            <p className="whitespace-nowrap text-[9px] font-bold uppercase tracking-wide text-cyan-200 sm:text-[10px] sm:tracking-wider">Ruta calculada</p>
            <p className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-white">
              {route.length > 1 ? `${route.length - 1} tramos · ${targetNode.name}` : targetNode.name}
            </p>
            <button
              type="button"
              onClick={clearDestination}
              className="mt-2 min-h-8 rounded-lg border border-white/15 bg-white/10 px-3 text-xs font-semibold text-slate-100 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              Limpiar
            </button>
          </aside>
        )}
      </div>
    </section>
  );
}
