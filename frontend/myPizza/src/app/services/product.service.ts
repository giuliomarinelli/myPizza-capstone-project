import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { CategoriesRes, Product, ProductNamesRes, Topping, ToppingDTO, ToppingRes } from '../Models/i-product';
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

  // -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
  // Toppings CRUD

  public getToppings(type?: string): Observable<ToppingRes> {
    const _type: string = type ? `?type=${type}` : ''
    return this.http.get<ToppingRes>(`${this.backendUrl}/api/toppings${_type}`, { withCredentials: true })
  }

  public addTopping(toppingDTO: ToppingDTO): Observable<Topping> {
    return this.http.post<Topping>(`${this.backendUrl}/api/toppings`, toppingDTO, { withCredentials: true })
  }

  public updateToppingByName(name: string, toppingDTO: ToppingDTO): Observable<Topping> {
    return this.http.put<Topping>(`${this.backendUrl}/api/toppings/${name}`, toppingDTO, { withCredentials: true })
  }

  public deleteToppingByName(name: string): Observable<ConfirmRes> {
    return this.http.delete<ConfirmRes>(`${this.backendUrl}/api/toppings/${name}`, { withCredentials: true })
  }

  // -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
  // Products CRUD and features

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
