import { TestBed } from '@angular/core/testing';

import { PaginationAdapterService } from './pagination-adapter.service';

describe('PaginationAdapterService', () => {
  let service: PaginationAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
