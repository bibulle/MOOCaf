/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { ParagraphService } from './paragraph.service';

describe('Service: Paragraph', () => {
  beforeEach(() => {
    addProviders([ParagraphService]);
  });

  it('should ...',
    inject([ParagraphService],
      (service: ParagraphService) => {
        expect(service).toBeTruthy();
      }));
});
