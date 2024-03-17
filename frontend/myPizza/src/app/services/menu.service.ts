import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../Models/i-page';
import { Menu } from '../Models/i-menu';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  private backendUrl: string = environment.backendUrl

  public getMenu(size: number, page?: number): Observable<Page<Menu>> {
    const _page = page || 0
    return this.http.get<Page<Menu>>(`${this.backendUrl}/public/menu?size=${size}&page=${_page}`)
  }

  public setMenu(menu: Menu[], size?: number, page?: number): Observable<Page<Menu>> {
    const _page = page || 0
    const _size = size || 25
    return this.http.post<Page<Menu>>(`${this.backendUrl}/api/set-menu?size=${_size}&page=${_page}`, menu, { withCredentials: true })
  }

}
