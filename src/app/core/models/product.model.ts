export type ProductBrand = 'Maybelline' | 'e.l.f' | 'ambas';
export type ProductBadge = 'nuevo' | 'agotado' | 'oferta' | 'próximamente';

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  description: string;
  image?: string;
  inStock: boolean;
  newProduct: boolean;
  badge?: ProductBadge;
}
