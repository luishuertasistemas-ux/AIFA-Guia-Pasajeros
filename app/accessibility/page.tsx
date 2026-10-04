'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PodotactileGuideModule } from '@/components/accessibility/PodotactileGuideModule';
import { useLanguage } from '@/LanguageContext';
import { translations } from '@/data/translations';

export default function AccessibilityPage() {
  const { language } = useLanguage();
  const copy = translations[language];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          <ArrowLeft aria-hidden="true" size={18} />
          {copy.details.backToMenu}
        </Link>
        <PodotactileGuideModule />
      </div>
    </main>
  );
}
