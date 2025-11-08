import { TestBed } from '@angular/core/testing';

import { PatisserieService } from './patisserie.service';

describe('PatisserieService', () => {
  let service: PatisserieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatisserieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
