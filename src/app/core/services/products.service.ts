import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private products: Product[] = [
    { id: '1', name: 'Bases Hidratantes', category: 'bases', brand: 'ambas', price: 15.99, description: 'Hidratación con cobertura natural todo el día', inStock: true },
    { id: '2', name: 'Bases Mates', category: 'bases', brand: 'ambas', price: 17.99, description: 'Acabado mate de larga duración sin brillos', inStock: true },
    { id: '3', name: 'Labiales Mates', category: 'labios', brand: 'ambas', price: 12.99, description: 'Labios definidos con pigmentación intensa', inStock: true },
    { id: '4', name: 'Gloss', category: 'labios', brand: 'ambas', price: 11.99, description: 'Brillo hidratante con efecto voluminizador', inStock: true },
    { id: '5', name: 'Blush Líquido', category: 'rostro', brand: 'ambas', price: 13.99, description: 'Color natural de larga duración en fórmula líquida', inStock: true },
    { id: '6', name: 'Blush Polvo', category: 'rostro', brand: 'ambas', price: 12.99, description: 'Rubor en polvo de textura suave y sedosa', inStock: true },
    { id: '7', name: 'Primers', category: 'primers', brand: 'ambas', price: 14.99, description: 'Prepara la piel para un maquillaje perfecto', inStock: true },
    { id: '8', name: 'Primers Matte', category: 'primers', brand: 'ambas', price: 15.99, description: 'Control de brillos desde la base', inStock: true },
    { id: '9', name: 'Polvos Sueltos', category: 'rostro', brand: 'ambas', price: 10.99, description: 'Fijación ligera con acabado luminoso', inStock: true },
    { id: '10', name: 'Bases Compactas', category: 'bases', brand: 'ambas', price: 16.99, description: 'Cobertura práctica y retoque fácil', inStock: true },
    { id: '11', name: 'Tintas Skin Base', category: 'bases', brand: 'ambas', price: 14.99, description: 'Textura ligera tipo segunda piel', inStock: true },
    { id: '12', name: 'Tintas de Labios', category: 'labios', brand: 'ambas', price: 11.99, description: 'Color intenso que dura todo el día', inStock: true },
    { id: '13', name: 'Fijadores', category: 'fijacion', brand: 'ambas', price: 13.99, description: 'Prolonga el maquillaje hasta 24 horas', inStock: true },
    { id: '14', name: 'Gel de Cejas', category: 'ojos', brand: 'ambas', price: 9.99, description: 'Define y fija las cejas todo el día', inStock: true },
    { id: '15', name: 'Rimel', category: 'ojos', brand: 'ambas', price: 12.99, description: 'Pestañas voluminizadas y definidas', inStock: true },
    { id: '16', name: 'Delineadores', category: 'ojos', brand: 'ambas', price: 10.99, description: 'Trazo preciso para ojos perfectos', inStock: true },
    { id: '17', name: 'Skin Care Coreano', category: 'skincare', brand: 'ambas', price: 19.99, description: 'Rutina coreana para piel perfecta', inStock: true },
  ];

  getAll(): Observable<Product[]> {
    return new BehaviorSubject(this.products).asObservable();
  }

  getById(id: string): Observable<Product | undefined> {
    return new BehaviorSubject(this.products).asObservable().pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  search(query: string, category?: string): Observable<Product[]> {
    return new BehaviorSubject(this.products).asObservable().pipe(
      map(products => {
        let filtered = products;
        
        if (query && query.trim()) {
          const searchTerm = query.toLowerCase().trim();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
          );
        }
        
        if (category && category.trim()) {
          filtered = filtered.filter(p => p.category === category);
        }
        
        return filtered;
      })
    );
  }

  getCategories(): string[] {
    return [...new Set(this.products.map(p => p.category))];
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return new BehaviorSubject(this.products).asObservable().pipe(
      map(products => products.filter(p => p.category === category))
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return new BehaviorSubject(this.products).asObservable().pipe(
      map(products => products.slice(0, 8))
    );
  }
}
