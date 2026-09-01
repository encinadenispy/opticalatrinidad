import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Sparkles, 
  Check, 
  X, 
  ChevronDown, 
  SlidersHorizontal,
  Layers,
  Glasses
} from 'lucide-react';
import { Brand, Category, ColorOption, FilterState, FrameShape } from '../types';

interface Props {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categories: Category[];
  brands: Brand[];
  colors: ColorOption[];
  totalResults: number;
}

const SHAPES_LIST: { shape: FrameShape; label: string }[] = [
  { shape: 'pantos', label: 'Pantos' },
  { shape: 'cuadrada', label: 'Cuadrada' },
  { shape: 'redonda', label: 'Redonda' },
  { shape: 'aviador', label: 'Aviador' },
  { shape: 'cat-eye', label: 'Cat-Eye' },
  { shape: 'hexagonal', label: 'Hexagonal' },
  { shape: 'rectangular', label: 'Rectangular' },
  { shape: 'mariposa', label: 'Mariposa' },
  { shape: 'ovalada', label: 'Ovalada' }
];

export const FilterSidebar: React.FC<Props> = ({
  filters,
  onFilterChange,
  categories,
  brands,
  colors,
  totalResults
}) => {
  const handleResetFilters = () => {
    onFilterChange({
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
  };

  const hasActiveFilters = 
    filters.categoryId !== 'all' ||
    filters.brand !== 'all' ||
    filters.shape !== 'all' ||
    filters.gender !== 'all' ||
    filters.colorId !== 'all' ||
    filters.lensType !== 'all' ||
    filters.onlyAvailable ||
    filters.onlyFeatured ||
    filters.searchQuery !== '';

  return (
    <aside 
      id="catalog-filters-sidebar"
      className="bg-white border border-black/10 rounded-2xl p-4 sm:p-5 space-y-5 text-[#1a1a1a] shadow-sm"
    >
      {/* Filters Header */}
      <div className="flex items-center justify-between pb-3 border-b border-black/10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7d5c41]">
          <SlidersHorizontal className="w-4 h-4 text-[#7d5c41]" />
          <span>Filtros ({totalResults} modelos)</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[11px] text-[#c0392b] hover:underline font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Categories list */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#7d5c41] block">
          Categoría
        </label>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onFilterChange({ ...filters, categoryId: 'all' })}
            className={`w-full px-3 py-1.5 rounded-lg text-xs text-left flex items-center justify-between transition-colors ${
              filters.categoryId === 'all'
                ? 'bg-[#7d5c41] text-white font-bold'
                : 'text-[#333333] hover:bg-[#f5f2ed]'
            }`}
          >
            <span>Todas las Categorías</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ ...filters, categoryId: cat.id })}
              className={`w-full px-3 py-1.5 rounded-lg text-xs text-left flex items-center justify-between transition-colors ${
                filters.categoryId === cat.id
                  ? 'bg-[#7d5c41] text-white font-bold'
                  : 'text-[#333333] hover:bg-[#f5f2ed]'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Frame Shapes Selector */}
      <div className="space-y-1.5 pt-2 border-t border-black/10">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#7d5c41]">
            Forma de Montura
          </label>
          {filters.shape !== 'all' && (
            <button
              onClick={() => onFilterChange({ ...filters, shape: 'all' })}
              className="text-[10px] text-[#7d5c41] hover:underline"
            >
              Borrar
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {SHAPES_LIST.map((item) => (
            <button
              key={item.shape}
              onClick={() => 
                onFilterChange({ 
                  ...filters, 
                  shape: filters.shape === item.shape ? 'all' : item.shape 
                })
              }
              className={`px-2 py-1.5 rounded-lg text-xs text-center border transition-all ${
                filters.shape === item.shape
                  ? 'border-[#7d5c41] bg-[#7d5c41] text-white font-bold shadow-xs'
                  : 'border-black/10 bg-[#f5f2ed] text-[#555555] hover:text-[#1a1a1a]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gender pills */}
      <div className="space-y-1.5 pt-2 border-t border-black/10">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#7d5c41] block">
          Género / Fisonomía
        </label>
        <div className="grid grid-cols-3 gap-1">
          {['all', 'hombre', 'mujer', 'unisex'].map((g) => (
            <button
              key={g}
              onClick={() => onFilterChange({ ...filters, gender: g })}
              className={`py-1.5 rounded-lg text-xs capitalize text-center border transition-all ${
                filters.gender === g
                  ? 'border-[#7d5c41] bg-[#7d5c41] text-white font-bold'
                  : 'border-black/10 bg-[#f5f2ed] text-[#555555] hover:text-[#1a1a1a]'
              }`}
            >
              {g === 'all' ? 'Todos' : g}
            </button>
          ))}
        </div>
      </div>

      {/* Frame Color Swatches */}
      <div className="space-y-1.5 pt-2 border-t border-black/10">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#7d5c41]">
            Color de Montura
          </label>
          {filters.colorId !== 'all' && (
            <button
              onClick={() => onFilterChange({ ...filters, colorId: 'all' })}
              className="text-[10px] text-[#7d5c41] hover:underline"
            >
              Borrar
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => 
                onFilterChange({
                  ...filters,
                  colorId: filters.colorId === c.id ? 'all' : c.id
                })
              }
              className={`group relative w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                filters.colorId === c.id
                  ? 'border-[#1a1a1a] scale-110 shadow-md ring-2 ring-[#7d5c41]/50'
                  : 'border-black/20 hover:scale-105'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            >
              {filters.colorId === c.id && (
                <Check className="w-3 h-3 text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Brand selection */}
      <div className="space-y-1.5 pt-2 border-t border-black/10">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#7d5c41] block">
          Marca
        </label>
        <select
          value={filters.brand}
          onChange={(e) => onFilterChange({ ...filters, brand: e.target.value })}
          className="w-full bg-[#f5f2ed] border border-black/10 text-xs text-[#1a1a1a] rounded-lg px-3 py-2 outline-none focus:border-[#7d5c41]"
        >
          <option value="all">Todas las Marcas</option>
          {brands.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name} ({b.origin})
            </option>
          ))}
        </select>
      </div>

      {/* Lens Type */}
      <div className="space-y-1.5 pt-2 border-t border-black/10">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#7d5c41] block">
          Tipo de Cristal / Lente
        </label>
        <select
          value={filters.lensType}
          onChange={(e) => onFilterChange({ ...filters, lensType: e.target.value })}
          className="w-full bg-[#f5f2ed] border border-black/10 text-xs text-[#1a1a1a] rounded-lg px-3 py-2 outline-none focus:border-[#7d5c41]"
        >
          <option value="all">Todos los Cristales</option>
          <option value="Polarizado HD">Polarizado HD</option>
          <option value="Solar UV400">Solar UV400</option>
          <option value="Blue Block Digital">Blue Block (Luz Azul)</option>
          <option value="Antirreflejante Premium">Antirreflejante Premium</option>
          <option value="Fotocromático Transitions">Fotocromático</option>
          <option value="Degradado Cosmético">Degradado Cosmético</option>
        </select>
      </div>

      {/* Toggles (Available & Featured) */}
      <div className="space-y-2 pt-2 border-t border-black/10">
        <label className="flex items-center gap-2 text-xs text-[#333333] cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={(e) => onFilterChange({ ...filters, onlyAvailable: e.target.checked })}
            className="w-4 h-4 rounded accent-[#7d5c41]"
          />
          <span>Solo modelos en stock inmediato</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-[#333333] cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyFeatured}
            onChange={(e) => onFilterChange({ ...filters, onlyFeatured: e.target.checked })}
            className="w-4 h-4 rounded accent-[#7d5c41]"
          />
          <span>Solo piezas destacadas / exclusivas</span>
        </label>
      </div>

    </aside>
  );
};
