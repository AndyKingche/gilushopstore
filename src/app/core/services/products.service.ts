import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { CatalogBrandDTO } from '../models/brand.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = environment.apiUrl+'api/v1/gessa/stock';
  private categoryApiUrl = environment.apiUrl+'api/v1/gessa/category';
  private productApiUrl = environment.apiUrl+'api/v1/gessa/product';
  private brandApiUrl = environment.apiUrl+'api/v1/gessa/catalog-brand';
  // Default outletId - in a real app this would come from configuration or user selection
  private outletId = 2;

  constructor(private http: HttpClient) {}

  /**
   * Get paginated products for online store
   * @param pageSize Number of products per page
   * @param offset Offset for pagination
   */
  getOnlineStoreProducts(pageSize: number = 4, offset: number = 0): Observable<Product[]> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('offset', offset.toString());

    return this.http.get<Product[]>(`${this.apiUrl}/online-store/${this.outletId}`, { params });
  }

  /**
   * Get total count of online store products
   */
  getOnlineStoreProductsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/online-store/${this.outletId}/count`);
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.categoryApiUrl}/all`);
  }

  /**
   * Get paginated products for online store by category
   * @param categoryId ID of the category
   * @param pageSize Number of products per page
   * @param offset Offset for pagination
   */
  getOnlineStoreProductsByCategory(categoryId: number, pageSize: number = 16, offset: number = 0): Observable<Product[]> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('offset', offset.toString());

    return this.http.get<Product[]>(`${this.categoryApiUrl}/online-store/${this.outletId}/category/${categoryId}`, { params });
  }

  /**
   * Get total count of products by category
   * @param categoryId ID of the category
   */
  getOnlineStoreProductsByCategoryCount(categoryId: number): Observable<number> {
    return this.http.get<number>(`${this.categoryApiUrl}/online-store/${this.outletId}/category/${categoryId}/count`);
  }

  /**
   * Search products by name
   * @param name Search term
   * @param pageSize Number of products per page
   * @param offset Offset for pagination
   */
  searchProducts(name: string, pageSize: number = 16, offset: number = 0): Observable<Product[]> {
    const params = new HttpParams()
      .set('name', name)
      .set('pageSize', pageSize.toString())
      .set('offset', offset.toString());

    return this.http.get<Product[]>(`${this.productApiUrl}/online-store/${this.outletId}/search`, { params });
  }

  /**
   * Get total count of search results
   * @param name Search term
   */
  searchProductsCount(name: string): Observable<number> {
    const params = new HttpParams().set('name', name);
    return this.http.get<number>(`${this.productApiUrl}/online-store/${this.outletId}/search/count`, { params });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  /**
   * Get all catalog brands
   */
  getAllCatalogBrands(): Observable<CatalogBrandDTO[]> {
    return this.http.get<CatalogBrandDTO[]>(`${this.brandApiUrl}`);
  }

  /**
   * Get paginated products for online store by brand
   * @param brandId UUID of the brand
   * @param pageSize Number of products per page
   * @param offset Offset for pagination
   */
  getOnlineStoreProductsByBrand(brandId: number, pageSize: number = 16, offset: number = 0): Observable<Product[]> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('offset', offset.toString());

    return this.http.get<Product[]>(`${this.brandApiUrl}/online-store/${this.outletId}/brand/${brandId}`, { params });
  }

  /**
   * Get total count of products by brand
   * @param brandId UUID of the brand
   */
  getOnlineStoreProductsByBrandCount(brandId: number): Observable<number> {
    return this.http.get<number>(`${this.brandApiUrl}/online-store/${this.outletId}/brand/${brandId}/count`);
  }
}
