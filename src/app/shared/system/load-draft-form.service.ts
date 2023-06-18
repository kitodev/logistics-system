import { Injectable, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ModalService,
  ModalType,
} from '../components/modal/modal.service';
import {
  LocalStorageScopes,
  LocalStorageService,
} from './local-storage.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoadDraftFormService {
  constructor(
    private localStorage: LocalStorageService,
    private modalService: ModalService
  ) {}

  loadDraftModal(
    key: string,
    formGroup: FormGroup,
    vcr: ViewContainerRef
  ): void {
    if (this.localStorage.getParsedItem(key, LocalStorageScopes.FORM_DRAFT)) {
      this.openModal(key, formGroup, vcr);
    }
  }

  saveFormData(key: string, value: unknown) {
    this.localStorage.setItem(key, value, LocalStorageScopes.FORM_DRAFT);
  }

  loadDraft<T>(key: string, vcr: ViewContainerRef): Observable<T> {
    const savedItem = this.localStorage.getParsedItem<T>(
      key,
      LocalStorageScopes.FORM_DRAFT
    );
    this.localStorage.clearItem(key, LocalStorageScopes.FORM_DRAFT);
    if (savedItem) {
      return this.modalService
        .openConfirmationModal(vcr, ModalType.FORM_DRAFT)
        .pipe(
          map((response) => {
            if (response) {
              return savedItem;
            } else {
              return null;
            }
          })
        );
    } else {
      return of(null);
    }
  }

  private openModal(
    key: string,
    formGroup: FormGroup,
    vcr: ViewContainerRef
  ): void {
    this.modalService
      .openConfirmationModal(vcr, ModalType.FORM_DRAFT)
      .subscribe((res) => {
        if (res) {
          formGroup.patchValue(
            this.localStorage.getParsedItem(
              key,
              LocalStorageScopes.FORM_DRAFT
            ) ?? {}
          );
          formGroup.markAsDirty();
        }
        this.localStorage.clearItem(key, LocalStorageScopes.FORM_DRAFT);
      });
  }
}
