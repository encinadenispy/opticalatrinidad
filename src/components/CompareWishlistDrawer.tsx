import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Scale, 
  Trash2, 
  MessageCircle, 
  ArrowRight, 
  Sparkles,
  Eye,
  Check
} from 'lucide-react';
import { OpticalStoreSettings, Product } from '../types';
import { buildWhatsAppLink } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  compareProducts: Product[];
  onRemoveWishlist: (id: string) => void;
  onRemoveCompare: (id: string) => void;
  onClearWishlist: () => void;
  onClearCompare: () => void;
  settings: OpticalStoreSettings;
  onQuickView: (p: Product) => void;
}

export const CompareWishlistDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  wishlistProducts,
  compareProducts,
  onRemoveWishlist,
  onRemoveCompare,
  onClearWishlist,
  onClearCompare,
  settings,
  onQuickView
}) => {
  const [activeTab, setActiveTab] = useState<'wishlist' | 'compare'>('wishlist');

  if (!isOpen) return null;

  return (
    <div 
      id="compare-wishlist-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white border border-black/10 rounded-2xl shadow-2xl overflow-hidden text-[#1a1a1a] my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#fbf9f6] border-b border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex bg-white p-1 rounded-xl border border-black/10 shadow-xs">
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'wishlist'
                    ? 'bg-[#7d5c41] text-white font-bold shadow-xs'
                    : 'text-[#666666] hover:text-[#1a1a1a]'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Favoritos ({wishlistProducts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('compare')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'compare'
                    ? 'bg-[#7d5c41] text-white font-bold shadow-xs'
                    : 'text-[#666666] hover:text-[#1a1a1a]'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Comparador ({compareProducts.length})</span>
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white text-[#666666] hover:text-[#1a1a1a] border border-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#f5f2ed] text-[#7d5c41] flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-base font-bold italic text-[#1a1a1a]">
                    Tu lista de favoritos está vacía
                  </h3>
                  <p className="text-xs text-[#666666] max-w-sm mx-auto">
                    Haz clic en el corazón de cualquier montura del catálogo para guardarla aquí y consultarla cuando desees.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-black/10">
                    <span className="text-xs text-[#666666]">
                      Tienes {wishlistProducts.length} modelo(s) guardado(s)
                    </span>
                    <button
                      onClick={onClearWishlist}
                      className="text-xs text-[#c0392b] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Vaciar favoritos</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistProducts.map((p) => {
                      const waLink = buildWhatsAppLink(p, settings);
                      return (
                        <div
                          key={p.id}
                          className="p-3 rounded-xl bg-white border border-black/10 flex flex-col justify-between space-y-3 shadow-xs hover:border-[#7d5c41] transition-all"
                        >
                          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#f5f2ed]">
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            <button
                              onClick={() => onRemoveWishlist(p.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:text-[#e74c3c] transition-colors"
                              title="Quitar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#7d5c41] font-bold">
                              {p.brand}
                            </span>
                            <h4 className="font-serif text-sm font-bold text-[#1a1a1a] truncate">
                              {p.name}
                            </h4>
                            <p className="text-xs text-[#666666] mt-0.5">
                              {p.primaryColorName} • Mod. {p.modelCode}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => onQuickView(p)}
                              className="py-1.5 rounded-lg bg-[#f5f2ed] text-xs font-semibold text-[#1a1a1a] hover:bg-[#ebe7e0] border border-black/10 transition-colors"
                            >
                              Detalles
                            </button>
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1.5 rounded-lg bg-[#25D366] text-xs font-bold text-white flex items-center justify-center gap-1 shadow-xs hover:bg-[#20ba59] transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-current" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: SIDE-BY-SIDE COMPARATOR */}
          {activeTab === 'compare' && (
            <div className="space-y-4">
              {compareProducts.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#f5f2ed] text-[#7d5c41] flex items-center justify-center mx-auto">
                    <Scale className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-base font-bold italic text-[#1a1a1a]">
                    No has seleccionado monturas para comparar
                  </h3>
                  <p className="text-xs text-[#666666] max-w-sm mx-auto">
                    En cada ficha de producto puedes presionar "+ Comparar" para analizar hasta 4 modelos cara a cara.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="flex justify-between items-center pb-3 border-b border-black/10">
                    <span className="text-xs text-[#666666]">
                      Comparando {compareProducts.length} monturas
                    </span>
                    <button
                      onClick={onClearCompare}
                      className="text-xs text-[#c0392b] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Limpiar comparador</span>
                    </button>
                  </div>

                  <table className="w-full text-xs text-left border-collapse mt-3">
                    <thead>
                      <tr className="border-b border-black/10">
                        <th className="p-3 text-[#666666] font-medium w-36">Característica</th>
                        {compareProducts.map((p) => (
                          <th key={p.id} className="p-3 text-center min-w-[200px] align-top">
                            <div className="relative">
                              <button
                                onClick={() => onRemoveCompare(p.id)}
                                className="absolute -top-2 -right-2 p-1 rounded-full bg-black/70 text-white hover:text-[#e74c3c] transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <img 
                                src={p.images[0]} 
                                alt={p.name} 
                                className="w-24 h-16 object-contain mx-auto rounded bg-[#f5f2ed] p-1 border border-black/10"
                              />
                              <h4 className="font-serif text-xs font-bold text-[#1a1a1a] mt-2 line-clamp-1">
                                {p.name}
                              </h4>
                              <p className="text-[11px] text-[#7d5c41] font-semibold">{p.brand}</p>
                              <p className="text-xs text-[#666666] mt-0.5">Mod. {p.modelCode}</p>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      <tr>
                        <td className="p-3 font-semibold text-[#1a1a1a]">Calibre (Lente)</td>
                        {compareProducts.map(p => (
                          <td key={p.id} className="p-3 text-center text-[#333333]">
                            {p.specifications.lensWidth} mm
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-[#1a1a1a]">Puente Nasal</td>
                        {compareProducts.map(p => (
                          <td key={p.id} className="p-3 text-center text-[#333333]">
                            {p.specifications.bridgeWidth} mm
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-[#1a1a1a]">Longitud Varilla</td>
                        {compareProducts.map(p => (
                          <td key={p.id} className="p-3 text-center text-[#333333]">
                            {p.specifications.templeLength} mm
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-[#1a1a1a]">Material</td>
                        {compareProducts.map(p => (
                          <td key={p.id} className="p-3 text-center text-[#555555] text-[11px]">
                            {p.specifications.material}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-[#1a1a1a]">Tipo de Lente</td>
                        {compareProducts.map(p => (
                          <td key={p.id} className="p-3 text-center text-[#7d5c41] font-medium">
                            {p.lensType}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-[#1a1a1a]">Forma / Género</td>
                        {compareProducts.map(p => (
                          <td key={p.id} className="p-3 text-center capitalize text-[#555555]">
                            {p.shape} • {p.gender}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-[#1a1a1a]">Acción WhatsApp</td>
                        {compareProducts.map(p => {
                          const wa = buildWhatsAppLink(p, settings);
                          return (
                            <td key={p.id} className="p-3 text-center">
                              <a
                                href={wa}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white font-bold text-xs hover:bg-[#20ba59] shadow-xs transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                <span>Consultar</span>
                              </a>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
