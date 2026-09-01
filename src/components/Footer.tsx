import React from 'react';
import { 
  Glasses, 
  Phone, 
  MapPin, 
  Clock, 
  Mail, 
  Instagram, 
  ShieldCheck, 
  Sparkles,
  Heart,
  Settings,
  Compass
} from 'lucide-react';
import { OpticalStoreSettings } from '../types';

interface Props {
  settings: OpticalStoreSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<Props> = ({
  settings,
  onOpenAdmin
}) => {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer 
      id="main-footer"
      className="bg-[#141414] border-t border-[#262626] text-[#e5e2db] pt-12 pb-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#262626]">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7d5c41] to-[#1a1a1a] flex items-center justify-center p-0.5 shadow-md">
                <div className="w-full h-full bg-[#1a1a1a] rounded-full flex items-center justify-center">
                  <Glasses className="w-4 h-4 text-[#f5f2ed]" />
                </div>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold italic tracking-wider text-[#f5f2ed]">
                  {settings.storeName}
                </span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-[#7d5c41] font-semibold">
                  {settings.slogan}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#999999] leading-relaxed max-w-md font-normal">
              {settings.brandStory}
            </p>

            <div className="pt-1">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola ${settings.storeName}! Quisiera recibir asesoramiento de monturas.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-transform hover:scale-105"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Atención por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#7d5c41]">
              Gestión & Garantía
            </h4>
            <ul className="space-y-1.5 text-xs text-[#aaaaaa]">
              <li>
                <button 
                  onClick={onOpenAdmin}
                  className="hover:text-[#7d5c41] flex items-center gap-1.5 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-[#7d5c41]" />
                  <span>Panel de Administración (Gestor de Catálogo)</span>
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[11px] text-[#7d5c41] font-bold block">Garantía Boutique:</span>
              <p className="text-[11px] text-[#888888]">
                {settings.deliveryNotice}
              </p>
            </div>
          </div>

          {/* Store info & Location */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#7d5c41]">
              Boutique & Contacto
            </h4>
            
            <div className="space-y-2 text-xs text-[#aaaaaa]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#7d5c41] shrink-0 mt-0.5" />
                <span>{settings.storeAddress}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#7d5c41] shrink-0" />
                <span>{settings.storeHours}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#7d5c41] shrink-0" />
                <span>{settings.emailContact}</span>
              </div>

              {settings.instagramHandle && (
                <div className="flex items-center gap-2.5 pt-0.5">
                  <Instagram className="w-4 h-4 text-[#7d5c41] shrink-0" />
                  <span className="text-[#f5f2ed] font-semibold">{settings.instagramHandle}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#777777]">
          <p>
            © {new Date().getFullYear()} {settings.storeName}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span>GitHub Pages Ready (HTML5 + JS)</span>
            <span>•</span>
            <span>Direct WhatsApp Checkout</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
