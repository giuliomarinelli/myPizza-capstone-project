import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Page, Pagination } from '../Models/i-page';
import { Menu } from '../Models/i-menu';
import { environment } from '../../environments/environment.development';
import { ConfirmRes } from '../Models/confirm-res';
import { PaginationAdapterService } from './pagination-adapter.service';
import { BackendPlatform } from '../../environments/backend-platform.enum';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient, private paginationAdapter: PaginationAdapterService) { }

  private backendUrl: string = environment.backendUrl

  public getMenu(size: number, page?: number): Observable<Page<Menu>> {
    if (environment.backendPlatform === BackendPlatform.JAVA) {
      const _page = page || 0
      return this.http.get<Page<Menu>>(`${this.backendUrl}/public/menu?size=${size}&page=${_page}`)
    }
      const _page = page ? page + 1 : 1
      return this.http.get<Pagination<Menu>>(`${this.backendUrl}/public/menu?limit=${size}&page=${_page}`)
        .pipe(map(res => this.paginationAdapter.adapt(res) as Page<Menu>))


  }

  public setMenu(menuIds: string[]): Observable<ConfirmRes> {
    return this.http.post<ConfirmRes>(`${this.backendUrl}/api/set-menu`, { menuIds }, { withCredentials: true })
  }

}
