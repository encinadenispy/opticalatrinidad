export type FrameShape = 
  | 'cuadrada' 
  | 'redonda' 
  | 'aviador' 
  | 'cat-eye' 
  | 'hexagonal' 
  | 'pantos' 
  | 'rectangular' 
  | 'mariposa' 
  | 'geométrica' 
  | 'ovalada';

export type GenderTarget = 'unisex' | 'hombre' | 'mujer' | 'junior';

export type LensType = 
  | 'Solar UV400' 
  | 'Polarizado HD' 
  | 'Blue Block Digital' 
  | 'Antirreflejante Premium' 
  | 'Fotocromático Transitions' 
  | 'Oftálmico Graduable' 
  | 'Degradado Cosmético';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  border?: string;
  texture?: 'solid' | 'tortoise' | 'metallic' | 'crystal';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  bannerImage?: string;
  itemCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  origin: string;
  description?: string;
  featured?: boolean;
}

export interface ProductSpecifications {
  lensWidth: number;   // Calibre (mm)
  bridgeWidth: number; // Puente (mm)
  templeLength: number;// Varilla (mm)
  frameWeight?: number;// Gramos (g)
  material: string;    // e.g. "Acetato Italiano Mazzucchelli", "Titanio Japonés Beta", "Acero Inoxidable"
  uvProtection?: string; // e.g. "100% UV400 Categoría 3"
  lensMaterial?: string; // e.g. "Cristal Mineral Barberini", "Policarbonato HD"
  faceRecommendation?: string[]; // e.g. ["Rostro Redondo", "Rostro Ovalado"]
  includedAccessories?: string; // e.g. "Estuche de cuero rígido, microfibra grabada y certificado"
}

export interface Product {
  id: string;
  name: string;
  modelCode: string; // SKU ej: "LA-2024-HAV"
  brand: string;
  categoryId: string;
  shape: FrameShape;
  gender: GenderTarget;
  lensType: LensType;
  colors: string[]; // IDs of ColorOption
  primaryColorName: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  shortDescription?: string;
  specifications: ProductSpecifications;
  isFeatured: boolean;
  isNew: boolean;
  isAvailable: boolean;
  badge?: string; // "Novedad", "Edición Limitada", "Best Seller", "Alta Gama"
  createdAt: string;
  tags?: string[];
}

export interface OpticalStoreSettings {
  storeName: string;
  slogan: string;
  whatsappNumber: string; // e.g. "34612345678" or "5491123456789"
  whatsappMessageTemplate: string; // Can use {producto}, {marca}, {modelo}, {precio}, {enlace}
  currencySymbol: string;
  currencyCode: string;
  storeAddress: string;
  storeCity: string;
  storeHours: string;
  instagramHandle: string;
  facebookUrl?: string;
  emailContact: string;
  bannerText: string;
  showAnnouncementBanner: boolean;
  brandStory: string;
  deliveryNotice: string;
}

export interface FilterState {
  searchQuery: string;
  categoryId: string;
  brand: string;
  shape: string;
  gender: string;
  colorId: string;
  material: string;
  lensType: string;
  minPrice: number;
  maxPrice: number;
  onlyAvailable: boolean;
  onlyFeatured: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'name-asc';
}
