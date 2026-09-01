import React, { useState, useEffect, useMemo } from 'react';
import { 
  Glasses, 
  MessageCircle, 
  Sparkles, 
  SlidersHorizontal, 
  Grid2X2, 
  Grid3X3, 
  Heart, 
  Search, 
  RotateCcw
} from 'lucide-react';

import { 
  Brand, 
  Category, 
  ColorOption, 
  FilterState, 
  FrameShape, 
  OpticalStoreSettings, 
  Product 
} from './types';
import { StorageService } from './services/storage';

import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CompareWishlistDrawer } from './components/CompareWishlistDrawer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/Footer';

export default function App() {
  // Database States
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [brands, setBrands] = useState<Brand[]>(() => StorageService.getBrands());
  const [colors, setColors] = useState<ColorOption[]>(() => StorageService.getColors());
  const [settings, setSettings] = useState<OpticalStoreSettings>(() => StorageService.getSettings());
  
  // Wishlist & Compare States
  const [wishlist, setWishlist] = useState<string[]>(() => StorageService.getWishlist());
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Navigation & Admin State
  const [isAdminView, setIsAdminView] = useState(false);

  // Modals
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Layout Grid Mode
  const [gridColumns, setGridColumns] = useState<'3' | '2' | '1'>('3');

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    categoryId: 'all',
    brand: 'all',
    shape: 'all',
    gender: 'all',
    colorId: 'all',
    material: 'all',
    lensType: 'all',
    minPrice: 0,
    maxPrice: 600,
    onlyAvailable: false,
    onlyFeatured: false,
    sortBy: 'featured'
  });

  // Listen to Storage Sync Events
  useEffect(() => {
    const handleSync = () => {
      setProducts(StorageService.getProducts());
      setCategories(StorageService.getCategories());
      setBrands(StorageService.getBrands());
      setColors(StorageService.getColors());
      setSettings(StorageService.getSettings());
      setWishlist(StorageService.getWishlist());
    };

    window.addEventListener('loptique:catalog_updated', handleSync);
    window.addEventListener('loptique:wishlist_updated', handleSync);

    // Deep link product check ?id=opt-001
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('id');
    if (prodId) {
      const found = StorageService.getProducts().find(p => p.id === prodId);
      if (found) setSelectedProductDetail(found);
    }

    return () => {
      window.removeEventListener('loptique:catalog_updated', handleSync);
      window.removeEventListener('loptique:wishlist_updated', handleSync);
    };
  }, []);

  // Wishlist toggle handler
  const handleToggleWishlist = (id: string) => {
    StorageService.toggleWishlist(id);
    setWishlist(StorageService.getWishlist());
  };

  // Compare toggle handler
  const handleToggleCompare = (product: Product) => {
    setCompareIds(prev => {
      if (prev.includes(product.id)) {
        return prev.filter(id => id !== product.id);
      } else {
        if (prev.length >= 4) {
          alert('Puedes comparar hasta un máximo de 4 monturas simultáneamente.');
          return prev;
        }
        return [...prev, product.id];
      }
    });
  };

  // Computed Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesModel = p.modelCode.toLowerCase().includes(query);
        const matchesShape = p.shape.toLowerCase().includes(query);
        const matchesColor = p.primaryColorName.toLowerCase().includes(query);
        const matchesTag = p.tags?.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesModel && !matchesShape && !matchesColor && !matchesTag) {
          return false;
        }
      }

      // Category
      if (filters.categoryId !== 'all' && p.categoryId !== filters.categoryId) {
        return false;
      }

      // Brand
      if (filters.brand !== 'all' && p.brand !== filters.brand) {
        return false;
      }

      // Shape
      if (filters.shape !== 'all' && p.shape !== filters.shape) {
        return false;
      }

      // Gender
      if (filters.gender !== 'all' && p.gender !== filters.gender && p.gender !== 'unisex') {
        return false;
      }

      // Color
      if (filters.colorId !== 'all' && !p.colors?.includes(filters.colorId)) {
        return false;
      }

      // Lens Type
      if (filters.lensType !== 'all' && p.lensType !== filters.lensType) {
        return false;
      }

      // Only Available
      if (filters.onlyAvailable && !p.isAvailable) {
        return false;
      }

      // Only Featured
      if (filters.onlyFeatured && !p.isFeatured) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      // Default: featured first
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, filters]);

  // Wishlist and Compare items mapped
  const wishlistProducts = useMemo(() => {
    return products.filter(p => wishlist.includes(p.id));
  }, [products, wishlist]);

  const compareProducts = useMemo(() => {
    return products.filter(p => compareIds.includes(p.id));
  }, [products, compareIds]);

  const handleScrollToCatalog = () => {
    const catalogEl = document.getElementById('catalog-grid-section');
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
  };

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#1a1a1a] flex flex-col selection:bg-[#7d5c41] selection:text-white">
      
      {/* Top Announcement Strip */}
      <AnnouncementBar settings={settings} />

      {/* Main Header & Navbar */}
      <Navbar
        settings={settings}
        categories={categories}
        activeCategoryId={filters.categoryId}
        onSelectCategory={(id) => setFilters(prev => ({ ...prev, categoryId: id }))}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistDrawerOpen(true)}
        onOpenAdmin={() => setIsAdminView(!isAdminView)}
        isAdminOpen={isAdminView}
        allProducts={products}
        onSelectProduct={(p) => setSelectedProductDetail(p)}
      />

      {/* Conditional: Admin View vs Public Catalog */}
      {isAdminView ? (
        <AdminDashboard
          products={products}
          categories={categories}
          brands={brands}
          colors={colors}
          settings={settings}
          onUpdateProducts={setProducts}
          onUpdateCategories={setCategories}
          onUpdateBrands={setBrands}
          onUpdateColors={setColors}
          onUpdateSettings={setSettings}
          onCloseAdmin={() => setIsAdminView(false)}
        />
      ) : (
        <>
          {/* Hero Section */}
          <HeroSection
            settings={settings}
            onExploreClick={handleScrollToCatalog}
          />

          {/* Quick Categories Navigation Strip */}
          <section className="bg-white border-b border-black/10 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto">
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs uppercase font-bold tracking-wider text-[#7d5c41] hidden md:inline">
                  Colección:
                </span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, categoryId: 'all' }))}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    filters.categoryId === 'all'
                      ? 'bg-[#7d5c41] text-white font-bold shadow-sm'
                      : 'bg-[#f5f2ed] text-[#333333] border border-black/10 hover:border-[#7d5c41]'
                  }`}
                >
                  Todas ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilters(prev => ({ ...prev, categoryId: cat.id }))}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                      filters.categoryId === cat.id
                        ? 'bg-[#7d5c41] text-white font-bold shadow-sm'
                        : 'bg-[#f5f2ed] text-[#333333] border border-black/10 hover:border-[#7d5c41]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Main Catalog Explorer Section */}
          <section id="catalog-grid-section" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
            
            {/* Catalog Control Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-black/10">
              
              {/* Left: Summary Results & Active category title */}
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold italic text-[#1a1a1a]">
                  {filters.categoryId === 'all' 
                    ? 'Catálogo Completo de Monturas' 
                    : categories.find(c => c.id === filters.categoryId)?.name || 'Monturas'}
                </h2>
                <p className="text-xs text-[#666666] mt-0.5 font-normal">
                  Mostrando <strong className="text-[#7d5c41] font-bold">{filteredProducts.length}</strong> modelos disponibles con asesoría directa por WhatsApp
                </p>
              </div>

              {/* Right: Sort selector, Grid toggles, Mobile Filter Trigger */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                
                {/* Mobile Filters Toggle Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  className="lg:hidden px-3.5 py-2 rounded-xl bg-white text-[#7d5c41] border border-black/10 text-xs font-semibold flex items-center gap-2 shadow-xs"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#7d5c41]" />
                  <span>Filtros</span>
                </button>

                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#666666] hidden sm:inline font-medium">Ordenar:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="bg-white border border-black/10 text-xs text-[#1a1a1a] rounded-lg px-3 py-2 outline-none focus:border-[#7d5c41] shadow-xs"
                  >
                    <option value="featured">Destacadas Atelier</option>
                    <option value="newest">Novedades Primero</option>
                    <option value="name-asc">Nombre: A - Z</option>
                  </select>
                </div>

                {/* Grid layout mode switcher (Desktop) */}
                <div className="hidden sm:flex items-center bg-white p-1 rounded-lg border border-black/10 shadow-xs">
                  <button
                    onClick={() => setGridColumns('3')}
                    className={`p-1.5 rounded transition-colors ${gridColumns === '3' ? 'bg-[#7d5c41] text-white' : 'text-[#777777] hover:text-[#1a1a1a]'}`}
                    title="Cuadrícula 3 Columnas"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridColumns('2')}
                    className={`p-1.5 rounded transition-colors ${gridColumns === '2' ? 'bg-[#7d5c41] text-white' : 'text-[#777777] hover:text-[#1a1a1a]'}`}
                    title="Cuadrícula 2 Columnas"
                  >
                    <Grid2X2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* Mobile Filter Drawer */}
            {isMobileFilterOpen && (
              <div className="lg:hidden py-4 border-b border-black/10">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  categories={categories}
                  brands={brands}
                  colors={colors}
                  totalResults={filteredProducts.length}
                />
              </div>
            )}

            {/* Grid Layout: Sidebar + Product Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
              
              {/* Desktop Left Filter Sidebar */}
              <div className="hidden lg:block lg:col-span-3 sticky top-28">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  categories={categories}
                  brands={brands}
                  colors={colors}
                  totalResults={filteredProducts.length}
                />
              </div>

              {/* Right Product Grid */}
              <div className="lg:col-span-9">
                
                {filteredProducts.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-white border border-black/10 space-y-4 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-[#f5f2ed] text-[#7d5c41] flex items-center justify-center mx-auto">
                      <Glasses className="w-7 h-7 text-[#7d5c41]" />
                    </div>
                    <h3 className="font-serif text-lg font-bold italic text-[#1a1a1a]">
                      No se encontraron monturas con los filtros seleccionados
                    </h3>
                    <p className="text-xs text-[#666666] max-w-md mx-auto">
                      Intenta buscar con otros términos o explorar todas las categorías.
                    </p>
                    <button
                      onClick={() => setFilters({
                        searchQuery: '',
                        categoryId: 'all',
                        brand: 'all',
                        shape: 'all',
                        gender: 'all',
                        colorId: 'all',
                        material: 'all',
                        lensType: 'all',
                        minPrice: 0,
                        maxPrice: 600,
                        onlyAvailable: false,
                        onlyFeatured: false,
                        sortBy: 'featured'
                      })}
                      className="px-5 py-2.5 rounded-xl bg-[#7d5c41] hover:bg-[#5a432f] text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Limpiar Todos los Filtros</span>
                    </button>
                  </div>
                ) : (
                  <div className={`grid gap-6 ${
                    gridColumns === '3'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2'
                  }`}>
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        settings={settings}
                        colorOptions={colors}
                        isWishlisted={wishlist.includes(product.id)}
                        onToggleWishlist={handleToggleWishlist}
                        isCompared={compareIds.includes(product.id)}
                        onToggleCompare={handleToggleCompare}
                        onQuickView={(p) => setSelectedProductDetail(p)}
                      />
                    ))}
                  </div>
                )}

              </div>

            </div>

          </section>

          {/* Value Proposition Luxury Strip */}
          <section className="bg-white border-t border-black/10 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="p-5 rounded-xl bg-[#fdfbf9] border border-black/10 space-y-2 shadow-xs">
                <span className="w-9 h-9 rounded-full bg-[#7d5c41]/10 flex items-center justify-center text-[#7d5c41] mx-auto md:mx-0">
                  <Glasses className="w-4 h-4 text-[#7d5c41]" />
                </span>
                <h4 className="font-serif text-sm font-bold italic text-[#1a1a1a]">
                  Asesoría Óptica & Graduación
                </h4>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Envíanos tu receta médica o consulta por WhatsApp y un asesor óptico te orientará sobre la curvatura y montura ideal para tus dioptrías.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#fdfbf9] border border-black/10 space-y-2 shadow-xs">
                <span className="w-9 h-9 rounded-full bg-[#7d5c41]/10 flex items-center justify-center text-[#7d5c41] mx-auto md:mx-0">
                  <MessageCircle className="w-4 h-4 text-[#7d5c41]" />
                </span>
                <h4 className="font-serif text-sm font-bold italic text-[#1a1a1a]">
                  Atención Directa Sin Intermediarios
                </h4>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Sin carritos complicados ni registros forzados. Cada montura se consulta en 1 clic para validar stock en boutique al instante.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#fdfbf9] border border-black/10 space-y-2 shadow-xs">
                <span className="w-9 h-9 rounded-full bg-[#7d5c41]/10 flex items-center justify-center text-[#7d5c41] mx-auto md:mx-0">
                  <Sparkles className="w-4 h-4 text-[#7d5c41]" />
                </span>
                <h4 className="font-serif text-sm font-bold italic text-[#1a1a1a]">
                  Materiales Nobles de Autor
                </h4>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Acetato de celulosa italiana Mazzucchelli 1849, Beta-Titanio japonés forjado y cristales minerales de alta definición.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Floating WhatsApp Action Button */}
      <aside 
        id="floating-whatsapp-dock"
        aria-label="Contacto directo por WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
      >
        {compareIds.length > 0 && (
          <button
            onClick={() => setIsWishlistDrawerOpen(true)}
            className="px-3.5 py-2 rounded-full bg-[#1C1814] text-[#E6C875] border border-[#C39738] text-xs font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <span>Comparar ({compareIds.length})</span>
          </button>
        )}

        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola ${settings.storeName}! Estoy visitando su catálogo web y me gustaría recibir asesoramiento.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-2xl shadow-black/80 transition-all hover:scale-105 active:scale-95"
          title="Consultar por WhatsApp a la óptica"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline font-semibold">WhatsApp Óptica</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-300 animate-ping pointer-events-none" />
        </a>
      </aside>

      {/* Modals & Overlays */}
      {selectedProductDetail && (
        <ProductDetailModal
          product={selectedProductDetail}
          settings={settings}
          colorOptions={colors}
          onClose={() => setSelectedProductDetail(null)}
          isWishlisted={wishlist.includes(selectedProductDetail.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {isWishlistDrawerOpen && (
        <CompareWishlistDrawer
          isOpen={isWishlistDrawerOpen}
          onClose={() => setIsWishlistDrawerOpen(false)}
          wishlistProducts={wishlistProducts}
          compareProducts={compareProducts}
          onRemoveWishlist={handleToggleWishlist}
          onRemoveCompare={(id) => setCompareIds(prev => prev.filter(x => x !== id))}
          onClearWishlist={() => {
            StorageService.saveWishlist([]);
            setWishlist([]);
          }}
          onClearCompare={() => setCompareIds([])}
          settings={settings}
          onQuickView={(p) => setSelectedProductDetail(p)}
        />
      )}

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminView(!isAdminView)}
      />

    </div>
  );
}
