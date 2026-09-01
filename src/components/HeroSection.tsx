import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { OpticalStoreSettings } from '../types';

interface Props {
  settings: OpticalStoreSettings;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<Props> = ({
  settings,
  onExploreClick
}) => {
  return (
    <section 
      id="hero-section"
      className="relative overflow-hidden bg-gradient-to-b from-[#fdfbf9] via-[#f9f7f2] to-[#f5f2ed] border-b border-black/10 py-10 md:py-14 lg:py-16 text-[#1a1a1a]"
    >
      {/* Subtle radial ambient background glow in warm saddle/tortoise tone */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-[#7d5c41]/8 blur-[120px] pointer-events-none -z-0" />
      <div className="absolute -bottom-10 right-0 w-[350px] h-[250px] bg-[#a67c52]/10 blur-[100px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/10 text-[#7d5c41] text-[10px] font-bold tracking-widest uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#7d5c41]" />
              <span>Colección Atelier 2026 • Monturas de Alta Gama</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold italic tracking-tight text-[#1a1a1a] leading-[1.15]">
              El arte de mirar con <span className="text-gold-gradient font-serif italic">distinción</span> y precisión.
            </h1>

            <p className="text-[#555555] text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Catálogo curado de monturas en acetato italiano Mazzucchelli, titanio japonés forjado y cristalería oftálmica de alta definición. Consulta directa y asesoría personalizada por WhatsApp.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                id="hero-explore-btn"
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl bg-[#7d5c41] hover:bg-[#5a432f] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#7d5c41]/20 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-5 border-t border-black/10">
              <div className="flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 text-[#7d5c41] shrink-0" />
                <span className="text-[11px] text-[#333333] font-medium">Acetato & Titanio</span>
              </div>
              <div className="flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 text-[#7d5c41] shrink-0" />
                <span className="text-[11px] text-[#333333] font-medium">UV400 & Polarizado</span>
              </div>
              <div className="flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 text-[#7d5c41] shrink-0" />
                <span className="text-[11px] text-[#333333] font-medium">WhatsApp 1-a-1</span>
              </div>
              <div className="flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 text-[#7d5c41] shrink-0" />
                <span className="text-[11px] text-[#333333] font-medium">Estuche de Cuero</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl p-1 bg-gradient-to-b from-[#7d5c41]/30 via-black/10 to-black/20 shadow-xl">
              <div className="bg-white rounded-[15px] p-5 overflow-hidden relative border border-black/5 shadow-inner">
                
                {/* Visual Label */}
                <div className="flex items-center justify-between pb-3 border-b border-black/10">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#7d5c41]">
                      Pieza Destacada
                    </span>
                    <h3 className="font-serif text-lg font-bold italic text-[#1a1a1a]">
                      Milano Gran Carey Sol
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#f5f2ed] text-[#7d5c41] text-[11px] font-bold uppercase tracking-wider border border-[#7d5c41]/30">
                    Edición Especial
                  </span>
                </div>

                {/* Hero Showcase Image */}
                <div className="relative my-4 aspect-[4/3] rounded-xl overflow-hidden bg-[#f5f5f5] group">
                  <img
                    src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
                    alt="Gafas de sol carey italiano"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px]">
                      Calibre: 49 □ 21 - 145
                    </span>
                    <span className="bg-[#7d5c41] text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                      Polarizado HD
                    </span>
                  </div>
                </div>

                {/* Micro specs */}
                <p className="text-xs text-[#666666] font-light italic">
                  "Tallado a mano en Varese con bisagras reforzadas de 7 nudillos y filtro polarizado de alto contraste."
                </p>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
