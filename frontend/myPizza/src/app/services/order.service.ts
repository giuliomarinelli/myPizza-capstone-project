import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ConfirmOrderDTO, GetOrderIdRes, Order, OrderCheckoutInfo, OrderInitDTO, OrderInitRes, SendOrderDTO } from '../Models/i-order';
import { Observable } from 'rxjs';
import { ConfirmRes } from '../Models/confirm-res';

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

  public getOrderInit(): Observable<OrderCheckoutInfo> {
    return this.http.get<OrderCheckoutInfo>(`${this.backendUrl}/public/get-client-order-init`, { withCredentials: true })
  }

  public sendOrder(sendOrderDTO: SendOrderDTO): Observable<ConfirmRes> {
    return this.http.post<ConfirmRes>(`${this.backendUrl}/public/send-order`, sendOrderDTO, { withCredentials: true })
  }

  public getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.backendUrl}/api/order/${orderId}`, { withCredentials: true })
  }

  public confirmOrder(confirmOrderDTO: ConfirmOrderDTO): Observable<ConfirmRes> {
    return this.http.post<ConfirmRes>(`${this.backendUrl}/api/order/confirm`, confirmOrderDTO, { withCredentials: true })
  }

  public rejectOrder(orderId: string): Observable<ConfirmRes> {
    return this.http.get<ConfirmRes>(`${this.backendUrl}/api/order/${orderId}/reject`, { withCredentials: true })
  }

  public completeOrder(orderId: string): Observable<ConfirmRes> {
    return this.http.get<ConfirmRes>(`${this.backendUrl}/api/order/${orderId}/set-completed`, { withCredentials: true })
  }

}
