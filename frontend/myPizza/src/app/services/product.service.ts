import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { CategoriesRes, ProductNamesRes, ToppingRes } from '../Models/i-product';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  private backendUrl: string = environment.backendUrl

  public getToppings(): Observable<ToppingRes> {
    return this.http.get<ToppingRes>(`${this.backendUrl}/api/toppings`, { withCredentials: true })
  }

  public getProductNames(): Observable<ProductNamesRes> {
    return this.http.get<ProductNamesRes>(`${this.backendUrl}/api/products/product-names`, { withCredentials: true })
  }

  public getCategories(): Observable<CategoriesRes> {
    return this.http.get<CategoriesRes>(`${this.backendUrl}/api/products/categories`, { withCredentials: true })
  }


}
