import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GetOrderIdRes, OrderCheckoutInfo, OrderInitDTO, OrderInitRes } from '../Models/i-order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  private backendUrl: string = environment.backendUrl

  public orderInit(orderInitDTO: OrderInitDTO): Observable<OrderInitRes> {
    return this.http.post<OrderInitRes>(`${this.backendUrl}/public/order-init`, orderInitDTO, { withCredentials: true })
  }

  public getOrderId(): Observable<GetOrderIdRes> {
    return this.http.get<GetOrderIdRes>(`${this.backendUrl}/public/get-client-order-id`, { withCredentials: true })
  }

  public getOrderInit(guest: boolean): Observable<OrderCheckoutInfo> {
    return this.http.get<OrderCheckoutInfo>(`${this.backendUrl}/public/get-client-order-init?guest=${guest}`, { withCredentials: true })
  }

}
