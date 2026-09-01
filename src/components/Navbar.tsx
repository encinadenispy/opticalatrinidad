import React, { useState } from 'react';
import { 
  Glasses, 
  Search, 
  Heart, 
  Settings, 
  MessageCircle, 
  Menu, 
  X
} from 'lucide-react';
import { Category, OpticalStoreSettings, Product } from '../types';

interface Props {
  settings: OpticalStoreSettings;
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  isAdminOpen: boolean;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
}

export const Navbar: React.FC<Props> = ({
  settings,
  categories,
  activeCategoryId,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  wishlistCount,
  onOpenWishlist,
  onOpenAdmin,
  isAdminOpen,
  allProducts,
  onSelectProduct
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Search live suggestions
  const searchResults = searchQuery.trim().length >= 2 
    ? allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.modelCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shape.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.primaryColorName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header 
      id="main-header"
      className="sticky top-0 z-40 bg-[#1a1a1a]/95 backdrop-blur-md border-b border-black/15 text-[#f5f2ed] transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              id="brand-logo-btn"
              onClick={() => {
                onSelectCategory('all');
                onSearchChange('');
              }}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7d5c41] to-[#1a1a1a] flex items-center justify-center p-0.5 shadow-md shadow-black/40 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#1a1a1a] rounded-full flex items-center justify-center">
                  <Glasses className="w-5 h-5 text-[#f5f2ed] group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div>
                <span className="block font-serif text-lg sm:text-xl font-bold italic tracking-wider text-[#f5f2ed] group-hover:text-[#7d5c41] transition-colors">
                  {settings.storeName}
                </span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-[#7d5c41] font-semibold">
                  {settings.slogan || 'Haute Lunetterie'}
                </span>
              </div>
            </button>
          </div>

          {/* Center: Search bar with instant autocomplete */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <input
                id="search-input-desktop"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Buscar por modelo, marca, carey, titanio..."
                className="w-full bg-[#262626] border border-[#3a3a3a] focus:border-[#7d5c41] text-[#f5f2ed] placeholder-[#999999] text-xs rounded-full pl-10 pr-9 py-2.5 outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-[#999999] absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-3 text-[#999999] hover:text-[#f5f2ed]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant Search Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-[#222222] border border-[#3a3a3a] rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-[#333333]"
                onMouseLeave={() => setShowSearchDropdown(false)}
              >
                <div className="p-2 text-[10px] font-bold tracking-widest uppercase text-[#7d5c41] bg-[#1a1a1a]">
                  Resultados encontrados ({searchResults.length})
                </div>
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectProduct(item);
                      setShowSearchDropdown(false);
                    }}
                    className="w-full px-3 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2c2c] transition-colors group"
                  >
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="w-10 h-10 object-cover rounded-lg border border-[#3a3a3a] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-[#f5f2ed] group-hover:text-[#7d5c41] truncate">
                          {item.name}
                        </p>
                        <span className="text-[11px] font-medium text-[#a0958b]">
                          {item.shape.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#a0958b] truncate">
                        {item.brand} • Mod. {item.modelCode} • {item.primaryColorName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Wishlist / Comparar button */}
            <button
              id="nav-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-lg text-[#f5f2ed] hover:text-white hover:bg-[#2c2c2c] border border-[#3a3a3a] transition-colors"
              title="Favoritos y Comparador"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-[#E57373] fill-[#E57373]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7d5c41] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard Switch */}
            <button
              id="nav-admin-dashboard-btn"
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                isAdminOpen
                  ? 'bg-[#7d5c41] text-white border-[#7d5c41] shadow-md shadow-[#7d5c41]/30'
                  : 'bg-[#262626] text-[#f5f2ed] border-[#3a3a3a] hover:bg-[#333333] hover:border-[#7d5c41]'
              }`}
            >
              <Settings className={`w-3.5 h-3.5 ${isAdminOpen ? 'animate-spin' : ''}`} />
              <span>{isAdminOpen ? 'Volver al Catálogo' : 'Dashboard Admin'}</span>
            </button>

            {/* WhatsApp Direct Fast Button */}
            <a
              id="nav-whatsapp-btn"
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola ${settings.storeName}! Estoy visitando su catálogo web y me gustaría consultar disponibilidad de monturas.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#25D366]/20 transition-all hover:scale-105"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="nav-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg text-[#f5f2ed] hover:bg-[#2c2c2c] lg:hidden border border-[#3a3a3a]"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3 pt-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar modelos, marcas, colores..."
              className="w-full bg-[#262626] border border-[#3a3a3a] text-[#f5f2ed] placeholder-[#999999] text-xs rounded-full pl-9 pr-8 py-2 outline-none"
            />
            <Search className="w-3.5 h-3.5 text-[#999999] absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2 text-[#999999]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#333333] py-4 space-y-3 animate-in fade-in duration-200">
            <p className="text-[10px] uppercase tracking-widest text-[#7d5c41] font-bold px-1">
              Colecciones
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  onSelectCategory('all');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  activeCategoryId === 'all'
                    ? 'bg-[#7d5c41] text-white'
                    : 'bg-[#262626] text-[#f5f2ed] border border-[#3a3a3a]'
                }`}
              >
                Todas las Monturas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    activeCategoryId === cat.id
                      ? 'bg-[#7d5c41] text-white'
                      : 'bg-[#262626] text-[#f5f2ed] border border-[#3a3a3a]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#333333]">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola ${settings.storeName}! Deseo consultar su catálogo.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Contactar por WhatsApp (+{settings.whatsappNumber})</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
