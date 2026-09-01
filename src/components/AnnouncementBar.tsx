import React from 'react';
import { Sparkles, Phone, ShieldCheck, Clock } from 'lucide-react';
import { OpticalStoreSettings } from '../types';

interface Props {
  settings: OpticalStoreSettings;
}

export const AnnouncementBar: React.FC<Props> = ({ settings }) => {
  if (!settings.showAnnouncementBanner) return null;

  return (
    <aside 
      id="announcement-bar"
      aria-label="Anuncios de la boutique"
      className="bg-[#1a1a1a] border-b border-black/20 text-[#f5f2ed] text-xs py-2 px-4 select-none relative z-40"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Sparkles className="w-3.5 h-3.5 text-[#7d5c41] shrink-0 animate-pulse" />
          <span className="font-medium tracking-wide">
            {settings.bannerText}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-5 text-[11px] text-[#c4b5a5]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7d5c41]" />
            <span>Garantía & Autenticidad 100%</span>
          </div>
          <span className="text-[#4a4038]">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#7d5c41]" />
            <span>{settings.storeHours.split('|')[0] || 'Atención personalizada'}</span>
          </div>
          <span className="text-[#4a4038]">•</span>
          <a 
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#f5f2ed] hover:text-[#7d5c41] hover:underline font-semibold transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>WhatsApp: +{settings.whatsappNumber}</span>
          </a>
        </div>
      </div>
    </aside>
  );
};
