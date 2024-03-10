import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { InternationalPrefix } from '../Models/i-international-prefix';

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

}
