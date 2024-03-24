import { TestBed } from '@angular/core/testing';

import { IsLoggedInVariantGuard } from './is-logged-in-variant.guard';

describe('IsLoggedInVariantGuard', () => {
  let guard: IsLoggedInVariantGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsLoggedInVariantGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
