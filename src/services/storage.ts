import { 
  DEFAULT_BRANDS, 
  DEFAULT_CATEGORIES, 
  DEFAULT_COLORS, 
  DEFAULT_PRODUCTS, 
  DEFAULT_SETTINGS 
} from '../data/defaultCatalog';
import { Brand, Category, ColorOption, OpticalStoreSettings, Product } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'loptique_products_v1',
  CATEGORIES: 'loptique_categories_v1',
  BRANDS: 'loptique_brands_v1',
  COLORS: 'loptique_colors_v1',
  SETTINGS: 'loptique_settings_v1',
  WISHLIST: 'loptique_wishlist_v1',
  COMPARE: 'loptique_compare_v1'
};

export const StorageService = {
  // Get all products
  getProducts(): Product[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading products from localStorage:', e);
    }
    // Save defaults if empty
    this.saveProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  },

  // Save products
  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      window.dispatchEvent(new CustomEvent('loptique:catalog_updated'));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  },

  // Categories
  getCategories(): Category[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading categories:', e);
    }
    this.saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  },

  saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      window.dispatchEvent(new CustomEvent('loptique:catalog_updated'));
    } catch (e) {
      console.error('Error saving categories:', e);
    }
  },

  // Brands
  getBrands(): Brand[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BRANDS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading brands:', e);
    }
    this.saveBrands(DEFAULT_BRANDS);
    return DEFAULT_BRANDS;
  },

  saveBrands(brands: Brand[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
      window.dispatchEvent(new CustomEvent('loptique:catalog_updated'));
    } catch (e) {
      console.error('Error saving brands:', e);
    }
  },

  // Colors
  getColors(): ColorOption[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COLORS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading colors:', e);
    }
    this.saveColors(DEFAULT_COLORS);
    return DEFAULT_COLORS;
  },

  saveColors(colors: ColorOption[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COLORS, JSON.stringify(colors));
      window.dispatchEvent(new CustomEvent('loptique:catalog_updated'));
    } catch (e) {
      console.error('Error saving colors:', e);
    }
  },

  // Store Settings
  getSettings(): OpticalStoreSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading settings:', e);
    }
    this.saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: OpticalStoreSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('loptique:catalog_updated'));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  },

  // Wishlist
  getWishlist(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveWishlist(ids: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(ids));
      window.dispatchEvent(new CustomEvent('loptique:wishlist_updated'));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  },

  toggleWishlist(productId: string): boolean {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter(id => id !== productId) : [...list, productId];
    this.saveWishlist(updated);
    return !exists;
  },

  // Reset to Factory Demo Data
  resetToDefaults(): void {
    this.saveProducts(DEFAULT_PRODUCTS);
    this.saveCategories(DEFAULT_CATEGORIES);
    this.saveBrands(DEFAULT_BRANDS);
    this.saveColors(DEFAULT_COLORS);
    this.saveSettings(DEFAULT_SETTINGS);
    this.saveWishlist([]);
  },

  // Export all database data to downloadable JSON file
  exportBackupJSON(): string {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      storeSettings: this.getSettings(),
      products: this.getProducts(),
      categories: this.getCategories(),
      brands: this.getBrands(),
      colors: this.getColors()
    };
    return JSON.stringify(data, null, 2);
  },

  // Import JSON file data
  importBackupJSON(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.products && Array.isArray(parsed.products)) {
        this.saveProducts(parsed.products);
      }
      if (parsed.categories && Array.isArray(parsed.categories)) {
        this.saveCategories(parsed.categories);
      }
      if (parsed.brands && Array.isArray(parsed.brands)) {
        this.saveBrands(parsed.brands);
      }
      if (parsed.colors && Array.isArray(parsed.colors)) {
        this.saveColors(parsed.colors);
      }
      if (parsed.storeSettings) {
        this.saveSettings(parsed.storeSettings);
      }
      return { success: true, message: '¡Catálogo importado y sincronizado con éxito!' };
    } catch (err) {
      return { success: false, message: 'El archivo JSON no tiene un formato válido.' };
    }
  }
};

/**
 * Generate Direct WhatsApp Link with pre-filled message for an Eyewear item
 */
export function buildWhatsAppLink(
  product: Product, 
  settings: OpticalStoreSettings, 
  customNote?: string
): string {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
  
  // Format template
  let message = settings.whatsappMessageTemplate || 
    "Hola! Me interesa la montura {producto} de {marca} (Modelo: {modelo}) con precio {precio}. ¿Está disponible?";
  
  message = message
    .replace('{tienda}', settings.storeName)
    .replace('{producto}', product.name)
    .replace('{marca}', product.brand)
    .replace('{modelo}', product.modelCode)
    .replace('{precio}', `${settings.currencySymbol} ${product.price.toLocaleString()}`)
    .replace('{color}', product.primaryColorName || 'Estándar');

  if (customNote) {
    message += `\n\n📌 Consulta adicional: "${customNote}"`;
  }

  // Include direct web link if possible
  const currentUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  if (currentUrl) {
    message += `\n\n🔗 Ver en catálogo: ${currentUrl}?id=${product.id}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Utility to compress uploaded image files to lightweight base64 strings
 */
export function compressImageFile(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
