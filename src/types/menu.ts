export interface Category {
  id: string;
  name: {
    es: string;
    en: string;
  };
  description?: {
    es: string;
    en: string;
  };
  image?: string;
  order: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: {
    es: string;
    en: string;
  };
  description?: {
    es: string;
    en: string;
  };
  price: number;
  image?: string;
  available: boolean;
  order: number;
  allergens?: string[];
  ingredients?: {
    es: string[];
    en: string[];
  };
}

export type Language = 'es' | 'en';