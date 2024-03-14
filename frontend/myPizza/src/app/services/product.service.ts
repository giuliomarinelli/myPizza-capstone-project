import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { CategoriesRes, Product, ProductNamesRes, ToppingRes } from '../Models/i-product';
import { HttpClient } from '@angular/common/http';
import { ManyProductsPostDTO, ProductDTO } from '../Models/i-product-dto';
import { Page } from '../Models/i-page';
import { ConfirmRes } from '../Models/confirm-res';

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

  public addManyProducts(productsDTO: ManyProductsPostDTO): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.backendUrl}/api/products/add-many`, productsDTO, { withCredentials: true })
  }

  public getProducts(size: number, page?: number): Observable<Page<Product>> {
    const _page = page ? page : 0
    return this.http.get<Page<Product>>(`${this.backendUrl}/api/products?size=${size}&page=${_page}`, { withCredentials: true })
  }

  public deleteProductByName(name: string): Observable<ConfirmRes> {
    return this.http.delete<ConfirmRes>(`${this.backendUrl}/api/products/${name}`, { withCredentials: true })
  }

  public updateProductByName(name: string, productDTO: ProductDTO): Observable<Product> {
    return this.http.put<Product>(`${this.backendUrl}/api/products/${name}`, productDTO, { withCredentials: true })
  }
}
