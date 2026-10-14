'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import type { MenuAction, MenuSection } from '@/data/menuSections';

type CategoryModalProps = {
  section: MenuSection | null;
  onClose: () => void;
  onAction: (action: MenuAction) => void;
};

export default function CategoryModal({ section, onClose, onAction }: CategoryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!section) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, section]);

  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase();
  const filteredItems = section?.items.filter((item) => (
    `${item.title} ${item.description}`.toLocaleLowerCase().includes(normalizedSearchTerm)
  )) ?? [];

  return (
    <AnimatePresence>
      {section && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-xl sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            className="relative my-auto flex max-h-[min(90svh,56rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-slate-900/80 text-white shadow-[0_24px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_42%)]" aria-hidden="true" />
            <header className="relative border-b border-white/10 px-5 pb-5 pt-7 sm:px-8 sm:pb-7 sm:pt-9">
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar categorías"
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-200 transition hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-300 sm:right-6 sm:top-6"
              >
                <X aria-hidden="true" size={21} />
              </button>
              <div className="flex items-start gap-4 pr-12 sm:gap-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/25 bg-emerald-300/10 text-emerald-200 shadow-lg shadow-emerald-950/20 sm:h-16 sm:w-16">
                  <section.icon aria-hidden="true" size={30} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Explora las opciones</p>
                  <h2 id="category-modal-title" className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">{section.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">{section.description}</p>
                </div>
              </div>
              <label className="mt-6 flex min-h-12 items-center gap-3 rounded-xl border border-white/15 bg-slate-950/50 px-4 text-slate-300 shadow-inner focus-within:border-emerald-300/70 focus-within:ring-2 focus-within:ring-emerald-300/30">
                <Search aria-hidden="true" size={19} className="shrink-0 text-emerald-200" />
                <span className="sr-only">Buscar categorías</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar una opción..."
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-400"
                />
              </label>
            </header>

            <div className="relative overflow-y-auto p-5 sm:p-8">
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredItems.map((item, index) => {
                    const content = (
                      <>
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-emerald-200 transition group-hover:border-emerald-200/40 group-hover:bg-emerald-300/15">
                          <item.icon aria-hidden="true" size={24} strokeWidth={1.8} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-base font-bold text-white">{item.title}</span>
                          <span className="mt-1 block text-sm leading-relaxed text-slate-300">{item.description}</span>
                        </span>
                        <ArrowRight aria-hidden="true" size={19} className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-200" />
                      </>
                    );
                    const className = 'group flex min-h-32 items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-emerald-200/35 hover:bg-white/10 focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-300';

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.035 }}
                      >
                        {item.href !== undefined ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            onClick={onClose}
                            className={className}
                          >
                            {content}
                          </a>
                        ) : (
                          <button type="button" onClick={() => onAction(item.action)} className={`${className} w-full`}>
                            {content}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-slate-300" role="status">
                  No se encontraron opciones que coincidan con la búsqueda.
                </p>
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
