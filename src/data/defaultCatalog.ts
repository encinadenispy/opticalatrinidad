import { Brand, Category, ColorOption, OpticalStoreSettings, Product } from '../types';

export const DEFAULT_COLORS: ColorOption[] = [
  { id: 'havana-classic', name: 'Havana / Carey Clásico', hex: '#8B5A2B', texture: 'tortoise' },
  { id: 'black-obsidian', name: 'Negro Ébano Mate', hex: '#1C1A17', texture: 'solid' },
  { id: 'black-gloss', name: 'Negro Piano Brillante', hex: '#0B0A09', texture: 'solid' },
  { id: 'champagne-gold', name: 'Oro Champagne 18K', hex: '#D4AF37', texture: 'metallic' },
  { id: 'amber-honey', name: 'Ámbar Miel Traslúcido', hex: '#C68B59', texture: 'crystal' },
  { id: 'tobacco-brown', name: 'Marrón Tabaco & Caramelo', hex: '#5D4037', texture: 'solid' },
  { id: 'crystal-smoke', name: 'Cristal Ahumado', hex: '#9E9E9E', texture: 'crystal' },
  { id: 'deep-burgundy', name: 'Borgoña / Vino Imperial', hex: '#4A1521', texture: 'solid' },
  { id: 'titanium-silver', name: 'Titanio Cepillado Plata', hex: '#A8A9AD', texture: 'metallic' },
  { id: 'olive-bronze', name: 'Verde Oliva & Bronce', hex: '#4B5320', texture: 'metallic' }
];

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'sol',
    name: 'Gafas de Sol',
    slug: 'gafas-de-sol',
    description: 'Protección UV400 premium con cristales polarizados y tintes degradados artesanales.',
    iconName: 'Sun',
    bannerImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
    itemCount: 8
  },
  {
    id: 'graduadas',
    name: 'Monturas Oftálmicas',
    slug: 'monturas-oftalmicas',
    description: 'Estructuras ultraligeras de titanio y acetato italiano listas para cualquier graduación visual.',
    iconName: 'Glasses',
    bannerImage: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80',
    itemCount: 6
  },
  {
    id: 'blue-block',
    name: 'Luz Azul (Digital)',
    slug: 'luz-azul',
    description: 'Filtro anti-fatiga para pantallas, monitores y dispositivos móviles con antirreflejante de alta definición.',
    iconName: 'Laptop',
    bannerImage: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80',
    itemCount: 4
  },
  {
    id: 'titanium-collection',
    name: 'Colección Titanio Japonés',
    slug: 'coleccion-titanio',
    description: 'Máxima ligereza de menos de 14 gramos forjadas a mano en Fukui, Japón.',
    iconName: 'Sparkles',
    bannerImage: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1200&q=80',
    itemCount: 4
  },
  {
    id: 'clip-on',
    name: 'Clip-On Magnético',
    slug: 'clip-on-magnetico',
    description: 'La versatilidad de pasar de montura graduada a gafa de sol polarizada en un clic magnético.',
    iconName: 'Layers',
    bannerImage: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80',
    itemCount: 3
  }
];

export const DEFAULT_BRANDS: Brand[] = [
  { id: 'atelier-prive', name: "L'Optique Atelier Privé", origin: 'Milán, Italia', description: 'Nuestra línea insigne en acetato Mazzucchelli y bisagras de 7 nudillos.', featured: true },
  { id: 'oliver-peoples', name: 'Oliver Peoples', origin: 'Los Ángeles, USA', description: 'Estética vintage atemporal y sofisticación de Hollywood.', featured: true },
  { id: 'tom-ford', name: 'Tom Ford Eyewear', origin: 'Florencia, Italia', description: 'El icónico detalle en T metálica y cortes geométricos de alta costura.', featured: true },
  { id: 'persol', name: 'Persol 1917', origin: 'Turín, Italia', description: 'El célebre sistema Meflecto flexible y la flecha Silver Arrow.', featured: true },
  { id: 'matsuda', name: 'Matsuda Artisans', origin: 'Fukui, Japón', description: 'Grabados en filigrana de plata y titanio aeroespacial.', featured: true },
  { id: 'cartier', name: 'Cartier Lunettes', origin: 'París, Francia', description: 'Lujo suntuoso con detalles en madera preciosa y oro macizo.', featured: false },
  { id: 'ray-ban', name: 'Ray-Ban Icons', origin: 'Italia / USA', description: 'Clásicos legendarios como Aviator, Wayfarer y Clubmaster.', featured: true }
];

export const DEFAULT_SETTINGS: OpticalStoreSettings = {
  storeName: "L'Optique Atelier",
  slogan: "Haute Lunetterie & Asesoría de Visagismo",
  whatsappNumber: "34600123456", // Número de ejemplo con código de país
  whatsappMessageTemplate: "¡Hola! Estoy visitando el catálogo web de {tienda} y me interesa consultar por la montura:\n\n✨ *{producto}*\n🏷️ Marca: *{marca}*\n🔢 Código/Modelo: *{modelo}*\n💰 Precio: *{precio}*\n🎨 Color: *{color}*\n\n¿Tienen stock disponible en tienda o podrían asesorarme con mi fórmula de graduación?",
  currencySymbol: "USD $",
  currencyCode: "USD",
  storeAddress: "Avenida Presidente Masaryk 410, Polanco / Gran Vía 28",
  storeCity: "Boutique Central",
  storeHours: "Lunes a Sábado: 10:00 - 20:00 | Domingos: 11:00 - 18:00",
  instagramHandle: "@loptique.atelier",
  facebookUrl: "https://instagram.com",
  emailContact: "contacto@loptique-atelier.com",
  bannerText: "✨ Colección Otoño/Invierno: Monturas en Carey Italiano y Titanio con Asesoría Gratuita de Visagismo por WhatsApp",
  showAnnouncementBanner: true,
  brandStory: "Fundada bajo la premisa de que las gafas son la primera pieza de arte que el mundo ve en tu rostro. Curamos las mejores casas independientes del mundo combinando visagismo anatómico y cristalería de precisión.",
  deliveryNotice: "Envíos asegurados a todo el país. Garantía de 2 años en monturas y tratamiento antirreflejo."
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'opt-001',
    name: 'Milano Gran Carey Sol',
    modelCode: 'LA-MLN-801-HAV',
    brand: "L'Optique Atelier Privé",
    categoryId: 'sol',
    shape: 'pantos',
    gender: 'unisex',
    lensType: 'Polarizado HD',
    colors: ['havana-classic', 'amber-honey', 'black-obsidian'],
    primaryColorName: 'Carey Havana Clásico',
    price: 240,
    originalPrice: 285,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Elegancia atemporal esculpida en acetato Mazzucchelli italiano de 8mm de grosor. Cristales minerales polarizados en tono marrón cálido con protección total UV400 y tratamiento antirreflejante interior.',
    shortDescription: 'Acetato italiano artesanal con lentes minerales polarizados color café tabaco.',
    specifications: {
      lensWidth: 49,
      bridgeWidth: 21,
      templeLength: 145,
      frameWeight: 34,
      material: 'Acetato Italiano Mazzucchelli 1849',
      uvProtection: '100% UV400 Categoría 3 (Polarizado)',
      lensMaterial: 'Cristal Mineral Barberini endurecido',
      faceRecommendation: ['Rostro Cuadrado', 'Rostro Ovalado', 'Rostro Diamante'],
      includedAccessories: 'Estuche de piel de becerro cosido a mano, gamuza de microfibra premium y spray limpiador antiestático'
    },
    isFeatured: true,
    isNew: true,
    isAvailable: true,
    badge: 'Best Seller',
    createdAt: '2026-08-15',
    tags: ['Carey', 'Polarizado', 'Artesanal', 'Milán']
  },
  {
    id: 'opt-002',
    name: 'Kyoto Titanium Pure',
    modelCode: 'MAT-KYO-109',
    brand: 'Matsuda Artisans',
    categoryId: 'titanium-collection',
    shape: 'redonda',
    gender: 'unisex',
    lensType: 'Antirreflejante Premium',
    colors: ['champagne-gold', 'titanium-silver', 'black-obsidian'],
    primaryColorName: 'Oro Champagne & Filigrana',
    price: 490,
    images: [
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Obra maestra japonesa construida enteramente en Beta-Titanio aeroespacial. Varillas con filigrana repujada a mano y almohadillas nasales en titanio hipoalergénico. Pesa únicamente 11 gramos.',
    shortDescription: 'Beta-Titanio ultraligero de 11g con acabados grabados a mano en Fukui.',
    specifications: {
      lensWidth: 47,
      bridgeWidth: 22,
      templeLength: 142,
      frameWeight: 11,
      material: 'Beta-Titanio Japonés Forjado',
      uvProtection: 'Filtro UV400 transparente + Antirreflejo HMC',
      lensMaterial: 'Orgánico Alto Índice 1.67',
      faceRecommendation: ['Rostro Cuadrado', 'Rostro Rectangular', 'Rostro Corazón'],
      includedAccessories: 'Cofre rígido de madera laqueada y certificado de artesanía'
    },
    isFeatured: true,
    isNew: true,
    isAvailable: true,
    badge: 'Alta Gama',
    createdAt: '2026-08-20',
    tags: ['Titanio', 'Japón', 'Ultraligero', 'Grabado']
  },
  {
    id: 'opt-003',
    name: 'Verona Square Obsidian',
    modelCode: 'TF-VRN-504',
    brand: 'Tom Ford Eyewear',
    categoryId: 'graduadas',
    shape: 'cuadrada',
    gender: 'hombre',
    lensType: 'Blue Block Digital',
    colors: ['black-obsidian', 'black-gloss', 'havana-classic'],
    primaryColorName: 'Negro Ébano Mate',
    price: 360,
    originalPrice: 410,
    images: [
      'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509695503495-cd9c11252d67?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Líneas arquitectónicas contundentes que proyectan autoridad y sofisticación contemporánea. Incorpora la icónica "T" metálica en oro cepillado integrada sutilmente en las sienes.',
    shortDescription: 'Silueta cuadrada imponente con bisagras reforzadas y detalle T metálico.',
    specifications: {
      lensWidth: 54,
      bridgeWidth: 18,
      templeLength: 145,
      frameWeight: 29,
      material: 'Acetato de Celulosa de Alta Densidad',
      uvProtection: 'Bloqueo de Luz Azul 420nm',
      lensMaterial: 'Resina CR-39 con revestimiento antirrayas',
      faceRecommendation: ['Rostro Redondo', 'Rostro Ovalado'],
      includedAccessories: 'Estuche de terciopelo marrón con logo grabado en oro'
    },
    isFeatured: true,
    isNew: false,
    isAvailable: true,
    badge: 'Edición Limitada',
    createdAt: '2026-07-28',
    tags: ['Negro', 'Cuadrado', 'Ejecutivo', 'Tom Ford']
  },
  {
    id: 'opt-004',
    name: 'Siena Cat-Eye Ámbar Miel',
    modelCode: 'LA-SIE-902-AMB',
    brand: "L'Optique Atelier Privé",
    categoryId: 'sol',
    shape: 'cat-eye',
    gender: 'mujer',
    lensType: 'Degradado Cosmético',
    colors: ['amber-honey', 'deep-burgundy', 'black-gloss'],
    primaryColorName: 'Ámbar Miel Traslúcido',
    price: 215,
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Una reinterpretación glamurosa del clásico estilo felino de los años 60. El acetato traslúcido ámbar capta la luz natural aportando calidez y realzando los pómulos de forma escultural.',
    shortDescription: 'Estilo felino sofisticado en acetato traslúcido tono miel cálida.',
    specifications: {
      lensWidth: 52,
      bridgeWidth: 19,
      templeLength: 140,
      frameWeight: 26,
      material: 'Acetato Cristal Óptico Pulido a Mano',
      uvProtection: '100% UVA/UVB Filtro Categoría 2-3',
      lensMaterial: 'Policarbonato HD con tinte café degradé',
      faceRecommendation: ['Rostro Redondo', 'Rostro Cuadrado', 'Rostro Ovalado'],
      includedAccessories: 'Funda rígida magnética y toallita de seda'
    },
    isFeatured: true,
    isNew: true,
    isAvailable: true,
    badge: 'Novedad',
    createdAt: '2026-08-25',
    tags: ['Cat-Eye', 'Femenino', 'Ámbar', 'Degradado']
  },
  {
    id: 'opt-005',
    name: 'Torino Pilot Aviator',
    modelCode: 'PER-TOR-649-BRN',
    brand: 'Persol 1917',
    categoryId: 'sol',
    shape: 'aviador',
    gender: 'unisex',
    lensType: 'Polarizado HD',
    colors: ['tobacco-brown', 'havana-classic', 'black-obsidian'],
    primaryColorName: 'Marrón Tabaco & Carey',
    price: 310,
    originalPrice: 345,
    images: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Diseño legendario con el puente en cerradura "Victorflex" que se amolda a la fisonomía nasal de forma ergonómica. La flecha Supreme en plata maciza distingue su autenticidad italiana.',
    shortDescription: 'El icono italiano con varillas flexibles Meflecto y lentes verde botella.',
    specifications: {
      lensWidth: 54,
      bridgeWidth: 20,
      templeLength: 145,
      frameWeight: 37,
      material: 'Acetato Natural & Sistema Flexible Victorflex',
      uvProtection: 'UV400 Polarizado de Máximo Contraste',
      lensMaterial: 'Cristal Fotocromático Polarizado Barberini',
      faceRecommendation: ['Rostro Ovalado', 'Rostro Corazón', 'Rostro Cuadrado'],
      includedAccessories: 'Estuche de cuero italiano repujado y certificado de origen'
    },
    isFeatured: true,
    isNew: false,
    isAvailable: true,
    badge: 'Icono Clásico',
    createdAt: '2026-07-10',
    tags: ['Aviador', 'Persol', 'Flex', 'Marrón']
  },
  {
    id: 'opt-006',
    name: 'Geneva Hexagonal Gold',
    modelCode: 'OP-GEN-703-GLD',
    brand: 'Oliver Peoples',
    categoryId: 'graduadas',
    shape: 'hexagonal',
    gender: 'unisex',
    lensType: 'Blue Block Digital',
    colors: ['champagne-gold', 'black-obsidian', 'olive-bronze'],
    primaryColorName: 'Oro Champagne Satinado',
    price: 380,
    images: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Geometría suave de seis facetas en metal chapado en oro de 18 quilates. Diseñado para quienes buscan un marco intelectual y vanguardista sin perder sutileza.',
    shortDescription: 'Estructura geométrica hexagonal en metal bañado en oro champagne.',
    specifications: {
      lensWidth: 50,
      bridgeWidth: 20,
      templeLength: 145,
      frameWeight: 14,
      material: 'Aleación de Monel & Titanio Chapado en Oro',
      uvProtection: 'Filtro Blue Shield 40% Luz Azul Artificial',
      lensMaterial: 'Orgánico Ultraligero Antirreflejo Super-Hidrófobo',
      faceRecommendation: ['Rostro Redondo', 'Rostro Ovalado'],
      includedAccessories: 'Estuche rígido vintage y paño de seda'
    },
    isFeatured: false,
    isNew: true,
    isAvailable: true,
    badge: 'Tendencia',
    createdAt: '2026-08-18',
    tags: ['Hexagonal', 'Dorado', 'Minimalista', 'Luz Azul']
  },
  {
    id: 'opt-007',
    name: 'Monaco Clip-On Duo Sol & Vista',
    modelCode: 'LA-MON-330-MAG',
    brand: "L'Optique Atelier Privé",
    categoryId: 'clip-on',
    shape: 'pantos',
    gender: 'unisex',
    lensType: 'Fotocromático Transitions',
    colors: ['black-obsidian', 'havana-classic', 'crystal-smoke'],
    primaryColorName: 'Negro Piano & Clip Carey',
    price: 275,
    originalPrice: 320,
    images: [
      'https://images.unsplash.com/photo-1509695503495-cd9c11252d67?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'La solución definitiva 2-en-1: montura oftálmica de lectura y trabajo diario con un suplemento magnético ultra-plano de sol con cristales polarizados que se acopla con un click imperceptible.',
    shortDescription: 'Gafa oftálmica graduada con clip solar magnético polarizado incluido.',
    specifications: {
      lensWidth: 50,
      bridgeWidth: 21,
      templeLength: 145,
      frameWeight: 22,
      material: 'Polímero TR-90 Aeroespacial con Imanes de Neodimio N52',
      uvProtection: '100% UV400 Polarizado en el Clip Solar',
      lensMaterial: 'Doble sistema: Óptico Claro + Solar Polarizado',
      faceRecommendation: ['Rostro Ovalado', 'Rostro Cuadrado', 'Rostro Diamante'],
      includedAccessories: 'Estuche doble con compartimento especial para el clip solar magnético'
    },
    isFeatured: true,
    isNew: false,
    isAvailable: true,
    badge: '2 en 1 Magnético',
    createdAt: '2026-07-05',
    tags: ['Clip-On', 'Magnético', 'Versátil', 'Polarizado']
  },
  {
    id: 'opt-008',
    name: 'Bordeaux Royale Butterfly',
    modelCode: 'CRT-BDX-880-BUR',
    brand: 'Cartier Lunettes',
    categoryId: 'sol',
    shape: 'mariposa',
    gender: 'mujer',
    lensType: 'Solar UV400',
    colors: ['deep-burgundy', 'black-obsidian', 'champagne-gold'],
    primaryColorName: 'Borgoña / Vino & Acentos Dorados',
    price: 520,
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Silueta mariposa de alta costura parisina en acetato color borgoña pulido a mano. Bisagras con detalles bañados en oro de 24 quilates inspirados en la alta joyería.',
    shortDescription: 'Lujo suntuoso con corte de mariposa envolvente y detalles en oro.',
    specifications: {
      lensWidth: 55,
      bridgeWidth: 17,
      templeLength: 140,
      frameWeight: 31,
      material: 'Acetato Francés Premium & Apliques Bañados en Oro 24K',
      uvProtection: '100% UV400 Cat. 3 con Filtro Infrarrojo',
      lensMaterial: 'Cristal Mineral Tinte Vino Degradé',
      faceRecommendation: ['Rostro Ovalado', 'Rostro Rectangular', 'Rostro Diamante'],
      includedAccessories: 'Estuche de cuero graneado rojo Cartier, paño bordado y tarjeta de autenticidad'
    },
    isFeatured: false,
    isNew: true,
    isAvailable: true,
    badge: 'Alta Costura',
    createdAt: '2026-08-22',
    tags: ['Mariposa', 'Borgoña', 'Lujo', 'Dorado']
  }
];

export const PRESET_GALLERY_IMAGES = [
  {
    title: 'Carey Havana Sol Frontal',
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
    category: 'Sol / Carey'
  },
  {
    title: 'Titanio Dorado Redondo',
    url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1000&q=80',
    category: 'Graduadas / Metal'
  },
  {
    title: 'Negro Acetato Cuadrado',
    url: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1000&q=80',
    category: 'Blue Light / Negro'
  },
  {
    title: 'Ámbar Translúcido Cat-Eye',
    url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80',
    category: 'Sol / Femenino'
  },
  {
    title: 'Aviador Vintage Carey & Oro',
    url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1000&q=80',
    category: 'Sol / Unisex'
  },
  {
    title: 'Montura Geométrica Fina',
    url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80',
    category: 'Graduadas / Titanio'
  },
  {
    title: 'Wayfarer Clásico Ébano',
    url: 'https://images.unsplash.com/photo-1509695503495-cd9c11252d67?auto=format&fit=crop&w=1000&q=80',
    category: 'Sol / Clásico'
  },
  {
    title: 'Detalle de Taller Óptico Artesanal',
    url: 'https://images.unsplash.com/photo-1582142839970-2b9dc34812aa?auto=format&fit=crop&w=1000&q=80',
    category: 'Editorial / Taller'
  }
];
