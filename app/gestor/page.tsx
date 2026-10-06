'use client';

import VideoReceptionConsole from '@/components/VideoReceptionConsole';
import { translations } from '@/data/translations';
import { useLanguage } from '@/LanguageContext';

export default function GestorPage() {
  const { language } = useLanguage();
  return <VideoReceptionConsole copy={translations[language].videoCall} />;
}
