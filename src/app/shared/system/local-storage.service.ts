import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private static createScopedKey(key: string, scope: LocalStorageScopes) {
    return `${scope}_${key}`;
  }

  public getItem(key: string, scope: LocalStorageScopes): string {
    const scopedKey = LocalStorageService.createScopedKey(key, scope);
    return localStorage.getItem(scopedKey);
  }

  getParsedItem<T>(key: string, scope: LocalStorageScopes): T | null {
    const item: string = this.getItem(key, scope);
    if (!item) {
      return null;
    }
    return JSON.parse(item);
  }

  setItem(key: string, value: unknown, scope: LocalStorageScopes): void {
    const scopedKey = LocalStorageService.createScopedKey(key, scope);
    let valueToStore: string;
    if (typeof value === 'string') {
      valueToStore = value;
    } else {
      valueToStore = JSON.stringify(value);
    }

    localStorage.setItem(scopedKey, valueToStore);
  }

  clearItem(key: string, scope: LocalStorageScopes): void {
    return this.setItem(key, '', scope);
  }

  clearAll(): void {
    localStorage.clear();
  }
}

export enum LocalStorageScopes {
  LOGON = 'logon',
  COL_SETTINGS = 'colSettings',
  COL_ORDER = 'colOrder',
  FORM_DRAFT = 'formDraft',
}

export enum SettingsSections {
  STATS = 'stats',
  VEHICLE = 'vehicle',
  PARCEL = 'parcel',
  LINE = 'line',
  COMPANY = 'company',
  EMPLOYEE = 'employee',
  PREMISE = 'premise',
  CONTACT = 'contact',
  LINE_ORG = 'organization-line',
  CONSIGNMENT_ORG = 'organization-consignment',
  OFFER_REQ = 'offer-request',
  OFFER_REC = 'offer-received',
  ORDER = 'order',
  FINANCIAL_MATRIX = 'financial-matrix',
  STATUS_LINE_ERRORS = 'errors-line',
  STATUS_CONSIGNMENT_ERRORS = 'errors-cons',
  STATUS_LINE_NOTIFICATION = 'status-line-notification',
  STATUS_CONSIGNMENT_NOTIFICATION = 'status-consignment-notification',
  HISTORY = 'history'
}
