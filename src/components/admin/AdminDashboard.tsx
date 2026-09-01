import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Upload, 
  Download, 
  RotateCcw, 
  Check, 
  X, 
  MessageCircle, 
  Settings, 
  Tag, 
  Layers, 
  Palette, 
  Glasses, 
  HelpCircle, 
  ExternalLink, 
  Sparkles,
  Save,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileJson,
  Building,
  Eye
} from 'lucide-react';
import { 
  Brand, 
  Category, 
  ColorOption, 
  FrameShape, 
  GenderTarget, 
  LensType, 
  OpticalStoreSettings, 
  Product 
} from '../../types';
import { PRESET_GALLERY_IMAGES } from '../../data/defaultCatalog';
import { StorageService, compressImageFile } from '../../services/storage';

interface Props {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  colors: ColorOption[];
  settings: OpticalStoreSettings;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onUpdateBrands: (brands: Brand[]) => void;
  onUpdateColors: (colors: ColorOption[]) => void;
  onUpdateSettings: (settings: OpticalStoreSettings) => void;
  onCloseAdmin: () => void;
}

export const AdminDashboard: React.FC<Props> = ({
  products,
  categories,
  brands,
  colors,
  settings,
  onUpdateProducts,
  onUpdateCategories,
  onUpdateBrands,
  onUpdateColors,
  onUpdateSettings,
  onCloseAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'brands' | 'colors' | 'settings' | 'backup' | 'hosting'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for Product
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    modelCode: '',
    brand: brands[0]?.name || "L'Optique Atelier Privé",
    categoryId: categories[0]?.id || 'sol',
    shape: 'cuadrada',
    gender: 'unisex',
    lensType: 'Solar UV400',
    colors: [colors[0]?.id || 'havana-classic'],
    primaryColorName: colors[0]?.name || 'Havana Carey',
    price: 195,
    originalPrice: undefined,
    images: [],
    description: '',
    shortDescription: '',
    specifications: {
      lensWidth: 51,
      bridgeWidth: 20,
      templeLength: 145,
      frameWeight: 28,
      material: 'Acetato Italiano Mazzucchelli',
      uvProtection: '100% UV400 Categoría 3',
      lensMaterial: 'Cristal Mineral Barberini',
      faceRecommendation: ['Rostro Ovalado', 'Rostro Redondo'],
      includedAccessories: 'Estuche de cuero rígido, microfibra grabada y certificado'
    },
    isFeatured: false,
    isNew: true,
    isAvailable: true,
    badge: 'Novedad'
  });

  const [customImageUrlInput, setCustomImageUrlInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Open modal to create product
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      modelCode: `OPT-${Math.floor(100 + Math.random() * 900)}`,
      brand: brands[0]?.name || "L'Optique Atelier",
      categoryId: categories[0]?.id || 'sol',
      shape: 'pantos',
      gender: 'unisex',
      lensType: 'Solar UV400',
      colors: [colors[0]?.id || 'havana-classic'],
      primaryColorName: colors[0]?.name || 'Havana Carey',
      price: 190,
      originalPrice: undefined,
      images: [PRESET_GALLERY_IMAGES[0].url],
      description: 'Montura de alta gama esculpida en acetato italiano con bisagras reforzadas.',
      shortDescription: 'Acetato italiano pulido a mano con protección total.',
      specifications: {
        lensWidth: 50,
        bridgeWidth: 20,
        templeLength: 145,
        frameWeight: 26,
        material: 'Acetato Italiano Mazzucchelli',
        uvProtection: '100% UV400',
        lensMaterial: 'Cristal Mineral Barberini',
        faceRecommendation: ['Rostro Ovalado', 'Rostro Cuadrado'],
        includedAccessories: 'Estuche rígido y microfibra'
      },
      isFeatured: false,
      isNew: true,
      isAvailable: true,
      badge: 'Novedad'
    });
    setIsProductModalOpen(true);
  };

  // Open modal to edit product
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setFormData(JSON.parse(JSON.stringify(p)));
    setIsProductModalOpen(true);
  };

  // Duplicate product
  const handleDuplicateProduct = (p: Product) => {
    const duplicated: Product = {
      ...JSON.parse(JSON.stringify(p)),
      id: `opt-${Date.now()}`,
      name: `${p.name} (Copia)`,
      modelCode: `${p.modelCode}-CPY`,
      createdAt: new Date().toISOString()
    };
    const updated = [duplicated, ...products];
    onUpdateProducts(updated);
    StorageService.saveProducts(updated);
    showToast(`¡Montura "${duplicated.name}" duplicada con éxito!`);
  };

  // Delete product
  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la montura "${name}"?`)) {
      const updated = products.filter(p => p.id !== id);
      onUpdateProducts(updated);
      StorageService.saveProducts(updated);
      showToast(`Montura eliminada correctamente.`);
    }
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.modelCode || !formData.price) {
      showToast('Por favor completa el nombre, código y precio.', 'error');
      return;
    }

    const imagesToSave = formData.images && formData.images.length > 0 
      ? formData.images 
      : [PRESET_GALLERY_IMAGES[0].url];

    if (editingProduct) {
      // Update
      const updatedList = products.map(p => 
        p.id === editingProduct.id 
          ? ({ ...formData, id: editingProduct.id, images: imagesToSave } as Product)
          : p
      );
      onUpdateProducts(updatedList);
      StorageService.saveProducts(updatedList);
      showToast(`¡Montura "${formData.name}" actualizada con éxito!`);
    } else {
      // Create new
      const newProduct: Product = {
        ...formData,
        id: `opt-${Date.now()}`,
        images: imagesToSave,
        createdAt: new Date().toISOString()
      } as Product;
      const updatedList = [newProduct, ...products];
      onUpdateProducts(updatedList);
      StorageService.saveProducts(updatedList);
      showToast(`¡Montura "${newProduct.name}" creada y añadida al catálogo!`);
    }

    setIsProductModalOpen(false);
  };

  // Handle local photo upload
  const handleUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressedBase64 = await compressImageFile(files[i], 1200, 1200, 0.85);
        newImages.push(compressedBase64);
      }
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
      showToast(`¡${newImages.length} foto(s) cargada(s) correctamente!`);
    } catch (err) {
      showToast('Error al procesar las imágenes.', 'error');
    }
  };

  // Add URL image
  const handleAddImageUrl = () => {
    if (!customImageUrlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), customImageUrlInput.trim()]
    }));
    setCustomImageUrlInput('');
    showToast('Imagen por enlace añadida.');
  };

  // Remove photo from form
  const handleRemoveFormImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  // Category manager states
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const slug = newCatName.toLowerCase().replace(/\s+/g, '-');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: slug,
      description: newCatDesc.trim() || 'Colección especializada de monturas.',
      iconName: 'Glasses'
    };
    const updated = [...categories, newCat];
    onUpdateCategories(updated);
    StorageService.saveCategories(updated);
    setNewCatName('');
    setNewCatDesc('');
    showToast(`Categoría "${newCat.name}" añadida.`);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar la categoría "${name}"?`)) {
      const updated = categories.filter(c => c.id !== id);
      onUpdateCategories(updated);
      StorageService.saveCategories(updated);
      showToast('Categoría eliminada.');
    }
  };

  // Brand manager states
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandOrigin, setNewBrandOrigin] = useState('');

  const handleAddBrand = () => {
    if (!newBrandName.trim()) return;
    const newB: Brand = {
      id: `brand-${Date.now()}`,
      name: newBrandName.trim(),
      origin: newBrandOrigin.trim() || 'Internacional',
      featured: true
    };
    const updated = [...brands, newB];
    onUpdateBrands(updated);
    StorageService.saveBrands(updated);
    setNewBrandName('');
    setNewBrandOrigin('');
    showToast(`Marca "${newB.name}" añadida.`);
  };

  const handleDeleteBrand = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar la marca "${name}"?`)) {
      const updated = brands.filter(b => b.id !== id);
      onUpdateBrands(updated);
      StorageService.saveBrands(updated);
      showToast('Marca eliminada.');
    }
  };

  // Color manager states
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#8B5A2B');

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    const newC: ColorOption = {
      id: `color-${Date.now()}`,
      name: newColorName.trim(),
      hex: newColorHex
    };
    const updated = [...colors, newC];
    onUpdateColors(updated);
    StorageService.saveColors(updated);
    setNewColorName('');
    showToast(`Color "${newC.name}" añadido.`);
  };

  const handleDeleteColor = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar el color "${name}"?`)) {
      const updated = colors.filter(c => c.id !== id);
      onUpdateColors(updated);
      StorageService.saveColors(updated);
      showToast('Color eliminado.');
    }
  };

  // Store Settings Form
  const [settingsForm, setSettingsForm] = useState<OpticalStoreSettings>({ ...settings });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    StorageService.saveSettings(settingsForm);
    showToast('¡Ajustes de la óptica y WhatsApp guardados con éxito!');
  };

  // Backup handlers
  const handleDownloadBackup = () => {
    const jsonStr = StorageService.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catalogo_optica_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('¡Respaldo JSON descargado!');
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importBackupJSON(content);
      if (res.success) {
        onUpdateProducts(StorageService.getProducts());
        onUpdateCategories(StorageService.getCategories());
        onUpdateBrands(StorageService.getBrands());
        onUpdateColors(StorageService.getColors());
        onUpdateSettings(StorageService.getSettings());
        showToast(res.message);
      } else {
        showToast(res.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (window.confirm('¿Estás seguro de restablecer todo el catálogo a los datos demo de fábrica? Se reemplazarán los cambios no respaldados.')) {
      StorageService.resetToDefaults();
      onUpdateProducts(StorageService.getProducts());
      onUpdateCategories(StorageService.getCategories());
      onUpdateBrands(StorageService.getBrands());
      onUpdateColors(StorageService.getColors());
      onUpdateSettings(StorageService.getSettings());
      showToast('Catálogo restablecido a valores de demostración.');
    }
  };

  // Filtered list for products table
  const filteredProductList = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.modelCode.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'all' || p.categoryId === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div 
      id="admin-dashboard-container"
      className="min-h-screen bg-[#0F0E0D] text-[#F5F2EB] pb-16"
    >
      {/* Toast Notification */}
      {statusMessage && (
        <div 
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-bold animate-in slide-in-from-bottom-5 duration-200 ${
            statusMessage.type === 'success'
              ? 'bg-[#1C281E] border-[#25D366] text-[#A6E8B8]'
              : 'bg-[#2E1818] border-[#E57373] text-[#F8B4B4]'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-[#25D366]" /> : <AlertCircle className="w-4 h-4 text-[#E57373]" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Top Admin Bar */}
      <div className="bg-[#1A1613] border-b border-[#2C241D] sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C39738] to-[#6A4E23] flex items-center justify-center p-0.5 shadow-md">
              <div className="w-full h-full bg-[#12100E] rounded-[10px] flex items-center justify-center">
                <Settings className="w-4 h-4 text-[#E6C875]" />
              </div>
            </div>
            <div>
              <h1 className="font-cinzel text-lg sm:text-xl font-bold text-[#F5F2EB]">
                Panel de Administración Atelier
              </h1>
              <p className="text-xs text-[#A69784]">
                Gestiona monturas, marcas, categorías y WhatsApp en tiempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreateProduct}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C39738] to-[#996D1E] hover:from-[#D4AF37] hover:to-[#B38024] text-[#0F0E0D] font-bold text-xs flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Montura</span>
            </button>

            <button
              onClick={onCloseAdmin}
              className="px-4 py-2 rounded-xl bg-[#221C16] hover:bg-[#2F271F] text-[#D8C7B0] border border-[#3E352B] text-xs font-semibold flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Catálogo Público</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pt-4 border-t border-[#2C241D]/60 mt-3">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-[#C39738] text-[#12100E] font-bold shadow'
                : 'text-[#A69784] hover:text-[#F5F2EB] hover:bg-[#25201A]'
            }`}
          >
            <Glasses className="w-4 h-4" />
            <span>Monturas ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-2 transition-all ${
              activeTab === 'categories'
                ? 'bg-[#C39738] text-[#12100E] font-bold shadow'
                : 'text-[#A69784] hover:text-[#F5F2EB] hover:bg-[#25201A]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categorías ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-2 transition-all ${
              activeTab === 'brands'
                ? 'bg-[#C39738] text-[#12100E] font-bold shadow'
                : 'text-[#A69784] hover:text-[#F5F2EB] hover:bg-[#25201A]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Marcas ({brands.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('colors')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-2 transition-all ${
              activeTab === 'colors'
                ? 'bg-[#C39738] text-[#12100E] font-bold shadow'
                : 'text-[#A69784] hover:text-[#F5F2EB] hover:bg-[#25201A]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Colores ({colors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-[#C39738] text-[#12100E] font-bold shadow'
                : 'text-[#A69784] hover:text-[#F5F2EB] hover:bg-[#25201A]'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Óptica & WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-2 transition-all ${
              activeTab === 'backup'
                ? 'bg-[#C39738] text-[#12100E] font-bold shadow'
                : 'text-[#A69784] hover:text-[#F5F2EB] hover:bg-[#25201A]'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span>Respaldos JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('hosting')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-2 transition-all ${
              activeTab === 'hosting'
                ? 'bg-[#C39738] text-[#12100E] font-bold shadow'
                : 'text-[#A69784] hover:text-[#F5F2EB] hover:bg-[#25201A]'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>GitHub Pages & Hosting</span>
          </button>
        </div>
      </div>

      {/* Body Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: PRODUCT MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Search & Filter bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#161310] border border-[#2E261E]">
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Buscar en el catálogo por nombre, marca o SKU..."
                  className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] placeholder-[#7D6F5E] rounded-lg px-3 py-2 outline-none focus:border-[#C39738]"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2 outline-none"
                >
                  <option value="all">Todas las Categorías</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <span className="text-xs text-[#A69784]">
                  {filteredProductList.length} de {products.length} productos
                </span>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#161310] border border-[#2E261E] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#12100E] border-b border-[#2C241D] text-[#A69784] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-4">Foto</th>
                      <th className="p-4">Modelo & Marca</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Forma & Calibre</th>
                      <th className="p-4">Precio</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#241E18]">
                    {filteredProductList.map((p) => (
                      <tr key={p.id} className="hover:bg-[#1D1915] transition-colors">
                        
                        {/* Image */}
                        <td className="p-4">
                          <img
                            src={p.images[0] || PRESET_GALLERY_IMAGES[0].url}
                            alt={p.name}
                            className="w-14 h-10 object-cover rounded-lg border border-[#3E352B] bg-[#0E0C0A]"
                          />
                        </td>

                        {/* Name & Brand */}
                        <td className="p-4">
                          <p className="font-bold text-[#F5F2EB] text-sm font-cinzel">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-[#A69784]">
                            {p.brand} • <strong className="text-[#C39738]">SKU: {p.modelCode}</strong>
                          </p>
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-[#221C16] text-[#D8C7B0] border border-[#3E352B] text-[11px]">
                            {categories.find(c => c.id === p.categoryId)?.name || p.categoryId}
                          </span>
                        </td>

                        {/* Shape & Measurements */}
                        <td className="p-4">
                          <p className="capitalize text-[#F5F2EB] font-semibold">
                            {p.shape} ({p.gender})
                          </p>
                          <p className="text-[11px] text-[#8A7B6B]">
                            {p.specifications.lensWidth}□{p.specifications.bridgeWidth}-{p.specifications.templeLength}
                          </p>
                        </td>

                        {/* Price */}
                        <td className="p-4">
                          <span className="font-bold text-[#E6C875] text-sm">
                            {settings.currencySymbol} {p.price.toLocaleString()}
                          </span>
                          {p.originalPrice && (
                            <span className="block text-[10px] text-[#7D6F5E] line-through">
                              {settings.currencySymbol} {p.originalPrice}
                            </span>
                          )}
                        </td>

                        {/* Availability Toggle */}
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.isAvailable 
                              ? 'bg-[#1E2E22] text-[#25D366] border border-[#25D366]/30' 
                              : 'bg-[#2E1818] text-[#E57373] border border-[#E57373]/30'
                          }`}>
                            {p.isAvailable ? 'Disponible' : 'Agotado'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            <button
                              onClick={() => handleDuplicateProduct(p)}
                              className="p-1.5 rounded-lg bg-[#221C16] text-[#A69784] hover:text-[#E6C875] border border-[#3E352B]"
                              title="Duplicar montura"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 rounded-lg bg-[#221C16] text-[#A69784] hover:text-[#C39738] border border-[#3E352B]"
                              title="Editar producto"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 rounded-lg bg-[#221C16] text-[#A69784] hover:text-[#E57373] border border-[#3E352B]"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CATEGORIES */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Create form */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-[#161310] border border-[#2E261E] space-y-4">
              <h3 className="font-cinzel text-base font-bold text-[#E6C875] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C39738]" />
                <span>Crear Nueva Categoría</span>
              </h3>

              <div className="space-y-1">
                <label className="text-xs text-[#A69784] block">Nombre de la Categoría</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Ej: Monturas Deportivas, Lentes Graduadas..."
                  className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2.5 outline-none focus:border-[#C39738]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#A69784] block">Descripción de la Colección</label>
                <textarea
                  rows={3}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Breve descripción visual de los modelos que pertenecen a esta categoría..."
                  className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2 outline-none focus:border-[#C39738]"
                />
              </div>

              <button
                onClick={handleAddCategory}
                className="w-full py-2.5 rounded-xl bg-[#C39738] hover:bg-[#D4AF37] text-[#12100E] font-bold text-xs transition-all"
              >
                Añadir Categoría
              </button>
            </div>

            {/* Existing categories list */}
            <div className="md:col-span-7 space-y-3">
              <h3 className="font-cinzel text-base font-bold text-[#F5F2EB]">
                Categorías Activas ({categories.length})
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => {
                  const count = products.filter(p => p.categoryId === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="p-4 rounded-xl bg-[#161310] border border-[#2E261E] flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel text-sm font-bold text-[#F5F2EB]">
                            {cat.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#221C16] text-[#C39738] border border-[#3E352B]">
                            {count} modelos
                          </span>
                        </div>
                        <p className="text-xs text-[#8A7B6B] mt-1 line-clamp-1">
                          {cat.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-2 rounded-lg bg-[#221C16] text-[#A69784] hover:text-[#E57373] border border-[#3E352B]"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BRANDS */}
        {/* ========================================================================= */}
        {activeTab === 'brands' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Create brand form */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-[#161310] border border-[#2E261E] space-y-4">
              <h3 className="font-cinzel text-base font-bold text-[#E6C875] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C39738]" />
                <span>Registrar Nueva Marca</span>
              </h3>

              <div className="space-y-1">
                <label className="text-xs text-[#A69784] block">Nombre de la Marca</label>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="Ej: Persol, Ray-Ban, Oliver Peoples..."
                  className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2.5 outline-none focus:border-[#C39738]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#A69784] block">País o Ciudad de Origen</label>
                <input
                  type="text"
                  value={newBrandOrigin}
                  onChange={(e) => setNewBrandOrigin(e.target.value)}
                  placeholder="Ej: Milán, Italia / Tokio, Japón / Los Ángeles, USA"
                  className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2 outline-none focus:border-[#C39738]"
                />
              </div>

              <button
                onClick={handleAddBrand}
                className="w-full py-2.5 rounded-xl bg-[#C39738] hover:bg-[#D4AF37] text-[#12100E] font-bold text-xs transition-all"
              >
                Añadir Marca
              </button>
            </div>

            {/* Brands list */}
            <div className="md:col-span-7 space-y-3">
              <h3 className="font-cinzel text-base font-bold text-[#F5F2EB]">
                Marcas Registradas ({brands.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {brands.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl bg-[#161310] border border-[#2E261E] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-cinzel text-sm font-bold text-[#F5F2EB]">
                        {b.name}
                      </h4>
                      <p className="text-xs text-[#C39738]">
                        {b.origin}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteBrand(b.id, b.name)}
                      className="p-2 rounded-lg bg-[#221C16] text-[#A69784] hover:text-[#E57373] border border-[#3E352B]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: COLORS */}
        {/* ========================================================================= */}
        {activeTab === 'colors' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Create color form */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-[#161310] border border-[#2E261E] space-y-4">
              <h3 className="font-cinzel text-base font-bold text-[#E6C875] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C39738]" />
                <span>Añadir Nuevo Tono / Color</span>
              </h3>

              <div className="space-y-1">
                <label className="text-xs text-[#A69784] block">Nombre del Tono</label>
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Ej: Carey Ámbar, Azul Medianoche, Titanio Humo..."
                  className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2.5 outline-none focus:border-[#C39738]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#A69784] block">Color Hexadecimal</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="flex-1 bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleAddColor}
                className="w-full py-2.5 rounded-xl bg-[#C39738] hover:bg-[#D4AF37] text-[#12100E] font-bold text-xs transition-all"
              >
                Guardar Color
              </button>
            </div>

            {/* Colors Grid */}
            <div className="md:col-span-7 space-y-3">
              <h3 className="font-cinzel text-base font-bold text-[#F5F2EB]">
                Paleta de Colores de Montura ({colors.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {colors.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-[#161310] border border-[#2E261E] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-5 h-5 rounded-full border border-black/50 shrink-0 shadow"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs font-semibold text-[#F5F2EB] truncate">
                        {c.name}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteColor(c.id, c.name)}
                      className="p-1.5 rounded bg-[#221C16] text-[#A69784] hover:text-[#E57373]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: OPTICAL STORE & WHATSAPP SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="max-w-3xl space-y-6">
            
            <div className="p-6 rounded-2xl bg-[#161310] border border-[#2E261E] space-y-5">
              <h3 className="font-cinzel text-base font-bold text-[#E6C875] flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span>Configuración Oficial de WhatsApp & Mensajes</span>
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#D8C7B0] block">
                  Número de WhatsApp Oficial (con código de país sin símbolos '+')
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  placeholder="Ej: 34600123456 (España), 5491123456789 (Argentina), 5215512345678 (México)"
                  className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3.5 py-2.5 outline-none focus:border-[#C39738]"
                />
                <p className="text-[11px] text-[#8A7B6B]">
                  Los clientes que hagan clic en cualquier botón de montura abrirán WhatsApp directamente a este número.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#D8C7B0] block">
                  Plantilla de Mensaje Pre-llenado en WhatsApp
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.whatsappMessageTemplate}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappMessageTemplate: e.target.value })}
                  className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg p-3 outline-none focus:border-[#C39738]"
                />
                <p className="text-[11px] text-[#A69784]">
                  Variables automáticas disponibles: <code className="text-[#E6C875]">{'{producto}'}</code>, <code className="text-[#E6C875]">{'{marca}'}</code>, <code className="text-[#E6C875]">{'{modelo}'}</code>, <code className="text-[#E6C875]">{'{precio}'}</code>, <code className="text-[#E6C875]">{'{color}'}</code>.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#161310] border border-[#2E261E] space-y-4">
              <h3 className="font-cinzel text-base font-bold text-[#F5F2EB]">
                Identidad de la Óptica & Tienda Física
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#A69784] block">Nombre de la Óptica</label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#A69784] block">Slogan de la Boutique</label>
                  <input
                    type="text"
                    value={settingsForm.slogan}
                    onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                    className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#A69784] block">Dirección de la Tienda</label>
                  <input
                    type="text"
                    value={settingsForm.storeAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeAddress: e.target.value })}
                    className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#A69784] block">Horarios de Atención</label>
                  <input
                    type="text"
                    value={settingsForm.storeHours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeHours: e.target.value })}
                    className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#A69784] block">Símbolo de Moneda</label>
                  <input
                    type="text"
                    value={settingsForm.currencySymbol}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })}
                    placeholder="USD $, EUR €, $ MXN..."
                    className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#A69784] block">Usuario de Instagram</label>
                  <input
                    type="text"
                    value={settingsForm.instagramHandle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                    placeholder="@tuoptica.atelier"
                    className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs text-[#A69784] block">Texto del Banner Superior de Anuncios</label>
                <input
                  type="text"
                  value={settingsForm.bannerText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bannerText: e.target.value })}
                  className="w-full bg-[#110F0D] border border-[#3E352B] text-xs text-[#F5F2EB] rounded-lg px-3 py-2 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-[#C39738] hover:bg-[#D4AF37] text-[#12100E] font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios de Configuración</span>
            </button>

          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: BACKUP & RESTORE */}
        {/* ========================================================================= */}
        {activeTab === 'backup' && (
          <div className="max-w-2xl space-y-6">
            <div className="p-6 rounded-2xl bg-[#161310] border border-[#2E261E] space-y-4">
              <h3 className="font-cinzel text-base font-bold text-[#E6C875] flex items-center gap-2">
                <Download className="w-5 h-5 text-[#C39738]" />
                <span>Exportar Respaldo Completo a JSON</span>
              </h3>
              <p className="text-xs text-[#A69784] leading-relaxed">
                Descarga un archivo seguro con todos tus productos, fotos, categorías, marcas y configuraciones. Puedes guardarlo en tu computadora o transferirlo a cualquier otro dispositivo o navegador.
              </p>
              <button
                onClick={handleDownloadBackup}
                className="py-3 px-6 rounded-xl bg-[#C39738] hover:bg-[#D4AF37] text-[#12100E] font-bold text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Archivo de Catálogo (.json)</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#161310] border border-[#2E261E] space-y-4">
              <h3 className="font-cinzel text-base font-bold text-[#F5F2EB] flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#A69784]" />
                <span>Importar Respaldo JSON</span>
              </h3>
              <p className="text-xs text-[#A69784] leading-relaxed">
                Carga un archivo de respaldo que hayas descargado previamente para restaurar todos tus modelos y datos.
              </p>
              <input
                type="file"
                accept=".json"
                ref={backupFileInputRef}
                onChange={handleImportBackupFile}
                className="hidden"
              />
              <button
                onClick={() => backupFileInputRef.current?.click()}
                className="py-3 px-6 rounded-xl bg-[#221C16] hover:bg-[#2F271F] text-[#E6C875] border border-[#3E352B] font-semibold text-xs flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Seleccionar archivo JSON de respaldo</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#161310] border border-[#3A1F1F] space-y-3">
              <h3 className="font-cinzel text-sm font-bold text-[#E57373] flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>Restablecer Catálogo a Valores Demo</span>
              </h3>
              <p className="text-xs text-[#8A7B6B]">
                Restaura la colección de muestra con las 8 monturas de lujo predeterminadas.
              </p>
              <button
                onClick={handleResetDemo}
                className="py-2 px-4 rounded-lg bg-[#2E1818] hover:bg-[#3E2020] text-[#E57373] text-xs font-semibold border border-[#E57373]/30"
              >
                Restablecer Todo
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: HOSTING & GITHUB PAGES CLARIFICATION */}
        {/* ========================================================================= */}
        {activeTab === 'hosting' && (
          <div className="max-w-3xl space-y-6">
            
            {/* Recommendation Box */}
            <div className="p-6 rounded-2xl bg-[#161310] border border-[#C39738]/40 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C39738]/20 flex items-center justify-center text-[#E6C875]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base font-bold text-[#F5F2EB]">
                    ¿Cómo publicar este catálogo en GitHub Pages o Vercel?
                  </h3>
                  <p className="text-xs text-[#A69784]">
                    Explicación técnica clara sobre PHP vs HTML/CSS/JS Estático
                  </p>
                </div>
              </div>

              <div className="text-xs text-[#D8C7B0] space-y-3 leading-relaxed">
                <p>
                  <strong>¿GitHub soporta PHP?</strong> <span className="text-[#E57373]">No de forma nativa.</span> GitHub Pages aloja únicamente archivos estáticos (HTML, CSS, JavaScript e imágenes). No ejecuta servidores de backend en PHP ni bases de datos MySQL.
                </p>
                <p>
                  <strong>¿Por qué esta solución en React/Vite es mucho mejor?</strong>
                  <br />
                  Este proyecto compila a puro <strong>HTML, CSS y JavaScript moderno ultrarrápido</strong> (en la carpeta <code>dist/</code>). Por ende:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#C4B5A5]">
                  <li>✅ <strong>100% Compatible con GitHub Pages</strong> sin costo alguno.</li>
                  <li>✅ <strong>100% Compatible con Vercel, Netlify o Cloud Run</strong> con 1 solo clic.</li>
                  <li>✅ <strong>No requiere pagar servidores PHP ni MySQL</strong>: Todo el catálogo se guarda al instante en el navegador con soporte de respaldo JSON y botones directos a WhatsApp.</li>
                  <li>✅ <strong>Puedes conectar tu propio dominio</strong> (ej: <code>www.tuoptica.com</code>) gratis en GitHub Pages o Vercel.</li>
                </ul>
              </div>
            </div>

            {/* Step-by-step deploy instructions */}
            <div className="p-6 rounded-2xl bg-[#161310] border border-[#2E261E] space-y-4">
              <h4 className="font-cinzel text-sm font-bold text-[#E6C875]">
                Paso a Paso para Subir a GitHub Pages:
              </h4>

              <ol className="space-y-3 text-xs text-[#C4B5A5]">
                <li className="p-3 rounded-lg bg-[#110F0D] border border-[#2C241D]">
                  <strong className="text-[#F5F2EB] block">1. Descargar el código o exportar a GitHub</strong>
                  Desde el menú de AI Studio haz clic en <em>Export to GitHub</em> o descarga el ZIP del proyecto.
                </li>
                <li className="p-3 rounded-lg bg-[#110F0D] border border-[#2C241D]">
                  <strong className="text-[#F5F2EB] block">2. Compilar el proyecto estático</strong>
                  En tu terminal ejecutas: <code className="text-[#E6C875]">npm run build</code> (esto genera la carpeta <code>dist</code> lista para la web).
                </li>
                <li className="p-3 rounded-lg bg-[#110F0D] border border-[#2C241D]">
                  <strong className="text-[#F5F2EB] block">3. Activar GitHub Pages o Vercel</strong>
                  En tu repositorio de GitHub ve a <em>Settings → Pages</em> y selecciona la rama de publicación, ¡o simplemente conecta el repositorio en <strong>vercel.com</strong> para tener tu catálogo en vivo en 30 segundos!
                </li>
              </ol>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT PRODUCT */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#161310] border border-[#3E352B] rounded-2xl shadow-2xl overflow-hidden text-[#F5F2EB] my-6 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-[#1A1613] border-b border-[#2C241D] flex items-center justify-between">
              <h2 className="font-cinzel text-lg font-bold text-[#F5F2EB] flex items-center gap-2">
                <Glasses className="w-5 h-5 text-[#C39738]" />
                <span>{editingProduct ? 'Editar Montura' : 'Crear Nueva Montura'}</span>
              </h2>

              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-full bg-[#12100E] text-[#A69784] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
              
              {/* Section 1: Basic Info */}
              <div className="space-y-4">
                <h4 className="font-bold text-[#E6C875] uppercase tracking-wider text-[11px] pb-1 border-b border-[#2C241D]">
                  1. Información Principal
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[#A69784] font-medium block">Nombre del Modelo *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Milano Gran Carey Sol"
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB] outline-none focus:border-[#C39738]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A69784] font-medium block">Código SKU / Modelo *</label>
                    <input
                      type="text"
                      required
                      value={formData.modelCode || ''}
                      onChange={(e) => setFormData({ ...formData, modelCode: e.target.value })}
                      placeholder="Ej: LA-801-HAV"
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB] outline-none focus:border-[#C39738]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#A69784] font-medium block">Marca</label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB] outline-none"
                    >
                      {brands.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A69784] font-medium block">Categoría</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB] outline-none"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A69784] font-medium block">Forma de la Montura</label>
                    <select
                      value={formData.shape}
                      onChange={(e) => setFormData({ ...formData, shape: e.target.value as FrameShape })}
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB] outline-none capitalize"
                    >
                      {['cuadrada', 'redonda', 'aviador', 'cat-eye', 'hexagonal', 'pantos', 'rectangular', 'mariposa', 'ovalada'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#A69784] font-medium block">Género / Destinatario</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderTarget })}
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB] outline-none capitalize"
                    >
                      <option value="unisex">Unisex</option>
                      <option value="hombre">Hombre</option>
                      <option value="mujer">Mujer</option>
                      <option value="junior">Junior</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A69784] font-medium block">Tipo de Cristal</label>
                    <select
                      value={formData.lensType}
                      onChange={(e) => setFormData({ ...formData, lensType: e.target.value as LensType })}
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB] outline-none"
                    >
                      <option value="Solar UV400">Solar UV400</option>
                      <option value="Polarizado HD">Polarizado HD</option>
                      <option value="Blue Block Digital">Blue Block Digital</option>
                      <option value="Antirreflejante Premium">Antirreflejante Premium</option>
                      <option value="Fotocromático Transitions">Fotocromático Transitions</option>
                      <option value="Degradado Cosmético">Degradado Cosmético</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A69784] font-medium block">Insignia / Badge</label>
                    <input
                      type="text"
                      value={formData.badge || ''}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="Best Seller, Edición Limitada..."
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#A69784] font-medium block">Precio ({settings.currencySymbol}) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB] font-bold text-sm outline-none focus:border-[#C39738]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A69784] font-medium block">Precio Anterior (Opcional tachado)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.originalPrice || ''}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB] outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* Section 2: Photos / Image Upload */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-[#E6C875] uppercase tracking-wider text-[11px] pb-1 border-b border-[#2C241D]">
                  2. Fotos de la Montura ({formData.images?.length || 0} imágenes cargadas)
                </h4>

                {/* Upload or Add URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Local file upload button */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={fileInputRef}
                      onChange={handleUploadPhotos}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 rounded-xl bg-[#221C16] hover:bg-[#2F271F] text-[#E6C875] border border-[#4A3D2D] font-bold flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Subir Fotos desde tu Computadora / Móvil</span>
                    </button>
                  </div>

                  {/* URL Input */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrlInput}
                      onChange={(e) => setCustomImageUrlInput(e.target.value)}
                      placeholder="O pegar URL de imagen..."
                      className="flex-1 bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 rounded-lg bg-[#2A2218] text-[#E6C875] border border-[#3E352B] font-semibold"
                    >
                      Añadir
                    </button>
                  </div>

                </div>

                {/* Preset Optics Stock Photos (1-click add) */}
                <div className="p-3 rounded-xl bg-[#110F0D] border border-[#2C241D] space-y-2">
                  <span className="text-[11px] text-[#A69784] font-medium block">
                    O selecciona de nuestras fotos ópticas en alta resolución de cortesía:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {PRESET_GALLERY_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            images: [...(prev.images || []), preset.url]
                          }));
                          showToast(`Foto "${preset.title}" añadida.`);
                        }}
                        className="relative aspect-[4/3] rounded-md overflow-hidden border border-[#3E352B] hover:border-[#C39738] group"
                        title={preset.title}
                      >
                        <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold text-white">
                          + Usar
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Uploaded Images List */}
                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#3E352B] bg-black">
                        <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveFormImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-white hover:text-[#E57373]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#C39738] text-[#12100E] font-bold text-[9px] px-1 rounded">
                            Principal
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Section 3: Specs & Measurements */}
              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-[#E6C875] uppercase tracking-wider text-[11px] pb-1 border-b border-[#2C241D]">
                  3. Calibre & Especificaciones
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#A69784]">Calibre / Lente (mm)</label>
                    <input
                      type="number"
                      value={formData.specifications?.lensWidth || 50}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications!, lensWidth: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A69784]">Puente (mm)</label>
                    <input
                      type="number"
                      value={formData.specifications?.bridgeWidth || 20}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications!, bridgeWidth: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A69784]">Varilla (mm)</label>
                    <input
                      type="number"
                      value={formData.specifications?.templeLength || 145}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications!, templeLength: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A69784]">Peso (gramos)</label>
                    <input
                      type="number"
                      value={formData.specifications?.frameWeight || 25}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications!, frameWeight: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#A69784]">Material de la Montura</label>
                    <input
                      type="text"
                      value={formData.specifications?.material || 'Acetato Italiano'}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications!, material: e.target.value }
                      })}
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A69784]">Protección UV / Filtro</label>
                    <input
                      type="text"
                      value={formData.specifications?.uvProtection || '100% UV400'}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications!, uvProtection: e.target.value }
                      })}
                      className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg px-3 py-2 text-[#F5F2EB]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[#A69784]">Descripción Detallada</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#110F0D] border border-[#3E352B] rounded-lg p-3 text-[#F5F2EB]"
                  />
                </div>

                {/* Available colors checkbox selector */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[#A69784] block font-semibold">
                    Colores Disponibles para esta montura:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => {
                      const isChecked = formData.colors?.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            const cur = formData.colors || [];
                            const updated = cur.includes(c.id) 
                              ? cur.filter(x => x !== c.id) 
                              : [...cur, c.id];
                            setFormData({ 
                              ...formData, 
                              colors: updated,
                              primaryColorName: updated.length > 0 ? (colors.find(x => x.id === updated[0])?.name || c.name) : c.name
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
                            isChecked
                              ? 'bg-[#2E261E] border-[#C39738] text-[#F5F2EB] font-bold'
                              : 'bg-[#12100E] border-[#2C241D] text-[#8A7B6B]'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="w-4 h-4 accent-[#C39738]"
                    />
                    <span className="font-semibold text-[#D8C7B0]">En Stock Inmediato</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-[#C39738]"
                    />
                    <span className="font-semibold text-[#D8C7B0]">Destacado en Portada</span>
                  </label>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#2C241D] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#221C16] text-[#A69784] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C39738] hover:bg-[#D4AF37] text-[#12100E] font-bold flex items-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Guardar Cambios' : 'Publicar en Catálogo'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
