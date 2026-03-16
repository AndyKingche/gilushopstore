import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = environment.apiUrl;
  private categoryApiUrl = 'http://localhost:8080/api/v1/gessa/category';
  // Default outletId - in a real app this would come from configuration or user selection
  private outletId = 1;

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
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.categoryApiUrl}/all`);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }
}
