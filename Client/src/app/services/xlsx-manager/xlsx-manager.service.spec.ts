import { TestBed } from '@angular/core/testing';

import { XlsxManagerService } from './xlsx-manager.service';

describe('XlsxManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XlsxManagerService = TestBed.get(XlsxManagerService);
    expect(service).toBeTruthy();
  });
});
