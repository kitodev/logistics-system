import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should retrieve correctly', () => {
    let key1;
    let text1;
    let key2;
    let text2;
    let scope1;
    let scope2;

    beforeEach(() => {
      key1 = 'test1';
      key2 = 'test2';
      text1 = 'Test string 1';
      text2 = 'Test string 2';
      scope1 = 'scope1';
      scope2 = 'scope2';

      service.setItem(key1, text1, scope1);
      service.setItem(key2, text2, scope2);
    });
    it('text should be what was stored with key 1', () => {
      const retrieved1 = service.getItem(key1, scope1);
      expect(retrieved1).toEqual(text1);
    });

    it('text should be what was stored with key 2', () => {
      const retrieved2 = service.getItem(key2, scope2);
      expect(retrieved2).toEqual(text2);
    });

    it('should not retrieve the other text with key 1', () => {
      const retrieved1 = service.getItem(key1, scope1);
      expect(retrieved1).not.toEqual(text2);
    });

    it('should not retrieve the other text with key 2', () => {
      const retrieved2 = service.getItem(key2, scope2);
      expect(retrieved2).not.toEqual(text1);
    });
  });
});
