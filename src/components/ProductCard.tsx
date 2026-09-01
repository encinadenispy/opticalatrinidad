import React, { useState } from 'react';
import { 
  MessageCircle, 
  Eye, 
  Heart, 
  Sparkles, 
  Check, 
  Plus, 
  Scale, 
  ShieldCheck 
} from 'lucide-react';
import { ColorOption, OpticalStoreSettings, Product } from '../types';
import { buildWhatsAppLink } from '../services/storage';

interface Props {
  product: Product;
  settings: OpticalStoreSettings;
  colorOptions: ColorOption[];
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<Props> = ({
  product,
  settings,
  colorOptions,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
  onQuickView
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeImage = isHovered && product.images.length > 1 
    ? product.images[1] 
    : product.images[0] || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80';

  const waLink = buildWhatsAppLink(product, settings);

  // Map product colors to full objects
  const productColors = colorOptions.filter(c => product.colors?.includes(c.id));

  return (
    <article 
      id={`product-card-${product.id}`}
      className="group relative bg-white border border-black/10 hover:border-[#7d5c41] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] bg-[#f8f6f2] overflow-hidden">
        
        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1">
          {product.badge && (
            <span className="px-2 py-0.5 rounded-full bg-[#7d5c41] text-white text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          )}
          {!product.isAvailable && (
            <span className="px-2 py-0.5 rounded-full bg-[#333333] text-white text-[9px] font-semibold">
              Bajo Pedido
            </span>
          )}
        </div>

        {/* Action icons (Wishlist & Quick View) */}
        <div className="absolute top-2.5 right-2.5 z-20 flex flex-col gap-1.5">
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md border border-black/10 flex items-center justify-center text-[#555555] hover:text-[#E57373] hover:scale-110 transition-all shadow-sm"
            title={isWishlisted ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'text-[#E57373] fill-[#E57373]' : ''}`} />
          </button>

          <button
            id={`quickview-btn-${product.id}`}
            onClick={() => onQuickView(product)}
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md border border-black/10 flex items-center justify-center text-[#555555] hover:text-[#7d5c41] hover:scale-110 transition-all shadow-sm"
            title="Vista rápida y detalles"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Product Image with Smooth Transition */}
        <div 
          className="w-full h-full cursor-pointer overflow-hidden flex items-center justify-center p-2.5"
          onClick={() => onQuickView(product)}
        >
          <img
            src={activeImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center rounded-lg transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Micro measurement bar */}
        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between pointer-events-none text-[9px] text-[#777777] bg-white/85 backdrop-blur-sm px-2 py-0.5 rounded border border-black/5">
          <span className="font-semibold">{product.shape.toUpperCase()}</span>
          <span>{product.specifications?.lensWidth || 50}□{product.specifications?.bridgeWidth || 20}-{product.specifications?.templeLength || 145}</span>
        </div>
      </div>

      {/* Product Content Info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        
        {/* Brand & Model */}
        <div>
          <div className="flex items-center justify-between gap-1 text-[10px] font-bold tracking-wider uppercase text-[#7d5c41]">
            <span className="truncate">{product.brand}</span>
            <span className="text-[#888888] text-[9px]">SKU: {product.modelCode}</span>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="font-serif text-sm sm:text-base font-bold italic text-[#1a1a1a] group-hover:text-[#7d5c41] transition-colors cursor-pointer mt-0.5 line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#666666] line-clamp-2 mt-0.5 font-normal leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Details: Lens type & Color swatches */}
        <div className="space-y-1.5 pt-2 border-t border-black/10">
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] text-[#555555] bg-[#f5f2ed] px-2 py-0.5 rounded border border-black/5 font-medium">
              {product.lensType}
            </span>
            
            {/* Color Swatch Dots */}
            {productColors.length > 0 && (
              <div className="flex items-center gap-1">
                {productColors.slice(0, 4).map((c) => (
                  <span
                    key={c.id}
                    title={c.name}
                    className="w-2.5 h-2.5 rounded-full border border-black/20 shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {productColors.length > 4 && (
                  <span className="text-[9px] text-[#888888]">+{productColors.length - 4}</span>
                )}
              </div>
            )}
          </div>

          {/* Availability & Compare button */}
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[11px] text-[#555555] font-medium">
              {product.primaryColorName}
            </span>

            {/* Compare pill */}
            <button
              onClick={() => onToggleCompare(product)}
              className={`text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                isCompared 
                  ? 'bg-[#7d5c41]/15 text-[#7d5c41] border border-[#7d5c41]/40' 
                  : 'text-[#888888] hover:text-[#1a1a1a]'
              }`}
            >
              <Scale className="w-2.5 h-2.5" />
              <span>{isCompared ? 'En comparador' : '+ Comparar'}</span>
            </button>
          </div>

        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 gap-1.5 pt-1">
          <a
            id={`wa-btn-${product.id}`}
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>

      </div>
    </article>
  );
};
