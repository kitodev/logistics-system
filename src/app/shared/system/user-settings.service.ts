import { Injectable } from '@angular/core';
import { TableCol } from '../table/TableCol';
import {
  LocalStorageScopes,
  LocalStorageService,
  SettingsSections,
} from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  constructor(private localStorage: LocalStorageService) {}

  getUserColumnSettings(key: SettingsSections): {} {
    return (
      this.localStorage.getParsedItem(key, LocalStorageScopes.COL_SETTINGS) ??
      {}
    );
  }

  saveUserColumnSettings(key: SettingsSections, settings: {}): void {
    this.localStorage.setItem(key, settings, LocalStorageScopes.COL_SETTINGS);
  }

  getUserColumnOrder(key: SettingsSections): [] {
    return this.localStorage.getParsedItem(key, LocalStorageScopes.COL_ORDER);
  }

  saveUserColumnOrder(key: SettingsSections, cols: Array<TableCol<any>>): void {
    this.localStorage.setItem(key, cols, LocalStorageScopes.COL_ORDER);
  }
}
