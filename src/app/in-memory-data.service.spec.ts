/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { InMemoryDataService } from './in-memory-data.service';

describe('Service: InMemoryData', () => {
  beforeEach(() => {
    addProviders([InMemoryDataService]);
  });

  it('should ...',
    inject([InMemoryDataService],
      (service: InMemoryDataService) => {
        expect(service).toBeTruthy();
      }));
});
