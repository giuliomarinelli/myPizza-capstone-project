import { Injectable } from '@angular/core';
import { Page, Pagination } from '../Models/i-page';

@Injectable({
  providedIn: 'root'
})
export class PaginationAdapterService {

  public adapt(pagination: Pagination<Object>): Page<Object> {
    return {
      content: pagination.items,
      size: pagination.meta.itemsPerPage,
      empty: pagination.meta.totalItems === 0,
      number: pagination.meta.itemCount,
      totalElements: pagination.meta.totalItems,
      totalPages: pagination.meta.totalPages
    }
  }

}
