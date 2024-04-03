import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../Models/i-page';
import { Menu } from '../Models/i-menu';
import { environment } from '../../environments/environment.production';
import { ConfirmRes } from '../Models/confirm-res';

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

  public setMenu(menuIds: string[]): Observable<ConfirmRes> {
    return this.http.post<ConfirmRes>(`${this.backendUrl}/api/set-menu`, { menuIds }, { withCredentials: true })
  }

}
