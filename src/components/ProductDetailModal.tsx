import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Heart, 
  Share2, 
  Check, 
  Ruler, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ColorOption, OpticalStoreSettings, Product } from '../types';
import { buildWhatsAppLink } from '../services/storage';

interface Props {
  product: Product | null;
  settings: OpticalStoreSettings;
  colorOptions: ColorOption[];
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const ProductDetailModal: React.FC<Props> = ({
  product,
  settings,
  colorOptions,
  onClose,
  isWishlisted,
  onToggleWishlist
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorId, setSelectedColorId] = useState<string>(product.colors[0] || '');
  const [customInquiryNote, setCustomInquiryNote] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const images = product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80'];

  const currentColorObj = colorOptions.find(c => c.id === selectedColorId);
  const waLink = buildWhatsAppLink(
    { ...product, primaryColorName: currentColorObj?.name || product.primaryColorName }, 
    settings, 
    customInquiryNote
  );

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?id=${product.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      id="product-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white border border-black/15 rounded-2xl shadow-2xl overflow-hidden text-[#1a1a1a] my-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/90 text-[#555555] hover:text-[#1a1a1a] hover:bg-[#f5f2ed] border border-black/10 transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left: Gallery Column */}
          <div className="md:col-span-6 p-6 bg-[#f8f6f2] flex flex-col justify-between border-b md:border-b-0 md:border-r border-black/10">
            
            <div className="space-y-4">
              {/* Main Image Viewport with Next/Prev */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white border border-black/10 flex items-center justify-center p-2">
                <img
                  src={images[activeImageIndex]}
                  alt={`${product.name} - Vista ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover object-center rounded-lg"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#7d5c41] text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx 
                          ? 'border-[#7d5c41] scale-105 shadow-md shadow-[#7d5c41]/20' 
                          : 'border-black/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Visual Measurement Specs Diagram */}
            <div className="mt-6 p-4 rounded-xl bg-white border border-black/10 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-[#7d5c41]">
                <span className="flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-[#7d5c41]" />
                  <span>Calibre Anatómico de la Montura</span>
                </span>
                <span className="text-[11px] text-[#777777]">En milímetros (mm)</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2 rounded bg-[#f8f6f2] border border-black/5">
                  <span className="text-[10px] text-[#777777] uppercase block">Lente</span>
                  <span className="text-sm font-bold text-[#1a1a1a] font-serif">
                    {product.specifications.lensWidth} mm
                  </span>
                </div>
                <div className="p-2 rounded bg-[#f8f6f2] border border-black/5">
                  <span className="text-[10px] text-[#777777] uppercase block">Puente</span>
                  <span className="text-sm font-bold text-[#1a1a1a] font-serif">
                    {product.specifications.bridgeWidth} mm
                  </span>
                </div>
                <div className="p-2 rounded bg-[#f8f6f2] border border-black/5">
                  <span className="text-[10px] text-[#777777] uppercase block">Varilla</span>
                  <span className="text-sm font-bold text-[#1a1a1a] font-serif">
                    {product.specifications.templeLength} mm
                  </span>
                </div>
              </div>

              {product.specifications.frameWeight && (
                <p className="text-[11px] text-[#777777] text-center pt-1">
                  Peso ultraligero: <strong className="text-[#1a1a1a]">{product.specifications.frameWeight} gramos</strong>
                </p>
              )}
            </div>

          </div>

          {/* Right: Info & WhatsApp Consultation Column */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold tracking-widest text-[#7d5c41] uppercase">
                  {product.brand}
                </span>
                <span className="text-xs text-[#777777]">
                  Código: <strong className="text-[#1a1a1a]">{product.modelCode}</strong>
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold italic text-[#1a1a1a] leading-tight">
                {product.name}
              </h2>

              {/* Status */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-[#555555] bg-[#f5f2ed] px-3 py-1 rounded-full border border-black/5 font-semibold">
                  {product.isAvailable ? 'En Stock Boutique' : 'Bajo Pedido'}
                </span>
                <span className="text-xs text-[#777777]">
                  Categoría: <strong className="text-[#1a1a1a] capitalize">{product.categoryId}</strong>
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#555555] leading-relaxed font-normal">
                {product.description}
              </p>
            </div>

            {/* Colors selection */}
            {product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1a1a1a] flex items-center justify-between">
                  <span>Color / Acabado de la montura:</span>
                  <span className="text-[#7d5c41] font-bold">
                    {currentColorObj?.name || product.primaryColorName}
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((colorId) => {
                    const cObj = colorOptions.find(c => c.id === colorId);
                    if (!cObj) return null;
                    return (
                      <button
                        key={colorId}
                        onClick={() => setSelectedColorId(colorId)}
                        className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 border transition-all ${
                          selectedColorId === colorId
                            ? 'border-[#7d5c41] bg-[#7d5c41] text-white font-bold shadow-sm'
                            : 'border-black/10 bg-[#f5f2ed] text-[#555555] hover:text-[#1a1a1a]'
                        }`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/20" 
                          style={{ backgroundColor: cObj.hex }} 
                        />
                        <span>{cObj.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Technical Specs List */}
            <div className="space-y-2 pt-2 border-t border-black/10">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#7d5c41]">
                Especificaciones Ópticas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-start gap-2 text-[#444444]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7d5c41] shrink-0 mt-0.5" />
                  <span><strong>Material:</strong> {product.specifications.material}</span>
                </div>
                <div className="flex items-start gap-2 text-[#444444]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7d5c41] shrink-0 mt-0.5" />
                  <span><strong>Cristales:</strong> {product.lensType}</span>
                </div>
                <div className="flex items-start gap-2 text-[#444444]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7d5c41] shrink-0 mt-0.5" />
                  <span><strong>Protección:</strong> {product.specifications.uvProtection || '100% UV400'}</span>
                </div>
                <div className="flex items-start gap-2 text-[#444444]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7d5c41] shrink-0 mt-0.5" />
                  <span><strong>Forma:</strong> {product.shape.toUpperCase()} ({product.gender})</span>
                </div>
              </div>
            </div>

            {/* Custom inquiry note input */}
            <div className="space-y-1">
              <label className="text-xs text-[#555555]">
                ¿Tienes una consulta específica o fórmula de graduación?
              </label>
              <input
                type="text"
                value={customInquiryNote}
                onChange={(e) => setCustomInquiryNote(e.target.value)}
                placeholder="Ej: ¿Tienen graduación para miopía -2.50? o ¿Hacen envíos a mi ciudad?"
                className="w-full bg-[#f5f2ed] border border-black/10 focus:border-[#7d5c41] text-xs text-[#1a1a1a] placeholder-[#888888] rounded-lg px-3 py-2 outline-none"
              />
            </div>

            {/* Main WhatsApp CTA */}
            <div className="space-y-2 pt-2">
              <a
                id="modal-whatsapp-cta"
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md shadow-[#25D366]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Pedir o Consultar por WhatsApp</span>
              </a>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="flex items-center gap-1.5 text-[#666666] hover:text-[#E57373] transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'text-[#E57373] fill-[#E57373]' : ''}`} />
                  <span>{isWishlisted ? 'Guardado en favoritos' : 'Añadir a favoritos'}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 text-[#666666] hover:text-[#7d5c41] transition-colors"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#25D366]" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? '¡Enlace copiado!' : 'Compartir montura'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
