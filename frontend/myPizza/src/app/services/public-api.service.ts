import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.production';
import { Observable, map } from 'rxjs';
import { InternationalPrefix } from '../Models/i-international-prefix';
import { CityAutocomplete } from '../Models/i-city-autocomplete';
import { UUID, randomUUID } from 'crypto';
import { AdminUserIdRes } from '../Models/i-user';

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {

  constructor(private http: HttpClient) { }

  private backendUrl = environment.backendUrl;

  public getAllInternationalPrefixes(): Observable<string[]> {
    return this.http.get<InternationalPrefix[]>(`${this.backendUrl}/public/international-prefixes`).pipe(map(res => {
      return res.map(r => r.prefix)
    }))
  }

  public cityAutocomplete(q: string, limit?: number): Observable<CityAutocomplete[]> {
    let apiUrl = `${this.backendUrl}/public/city-autocomplete?q=${q}`
    if (limit) apiUrl += `&limit=${limit}`
    return this.http.get<CityAutocomplete[]>(apiUrl)
  }

  public getAdminUserId(): Observable<string> {
    return this.http.get<AdminUserIdRes>(`${this.backendUrl}/api/user-profile/get-admin-userid`).pipe(map(res => {
      return res.adminUserId
    }))
  }

}
