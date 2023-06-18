import {
  ComponentFactoryResolver,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { take, tap } from 'rxjs/operators';
import {
  ConfirmationModal,
  InputModal,
  ModalComponent,
  ModalInputType,
  SelectModal,
} from './modal.component';
import { Observable } from 'rxjs';
import { FormSelectItem } from '../../form/select/FormSelectItem';
import { ConsignmentBulkEditorComponent } from './consignment-bulk-editor/consignment-bulk-editor.component';
import { OrderBulkEditorComponent } from './order-bulk-editor/order-bulk-editor.component';

export enum ModalType {
  DELETE,
  FORM_DRAFT,
  GENERAL,
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  vcr: ViewContainerRef;

  constructor(private cfr: ComponentFactoryResolver) {}

  openConfirmationModal(
    vcr: ViewContainerRef,
    type: ModalType = ModalType.GENERAL,
    body?: string,
    title?: string
  ): Observable<boolean> {
    return this.openModal(
      vcr,
      ModalService.getTitle(type, title),
      ModalService.getBody(type, body),
      type === ModalType.DELETE ? body : undefined
    );
  }

  openModal(
    vcr: ViewContainerRef,
    title: string,
    body: string,
    item: string,
  ): Observable<boolean> {
    this.vcr = vcr;
    const factory = this.cfr.resolveComponentFactory(
      ModalComponent
    );
    const ref = factory.create(this.vcr.injector);

    (<ConfirmationModal>ref.instance).title = title;
    (<ConfirmationModal>ref.instance).body = body;
    (<ConfirmationModal>ref.instance).item = item;

    setTimeout(() => this.vcr.insert(ref.hostView));

    return (<ConfirmationModal>ref.instance).destroy$.asObservable().pipe(
      take(1),
      tap(() => ref.destroy())
    );
  }

  openInputModal(
    vcr: ViewContainerRef,
    title: string,
    body: string,
    type: ModalInputType,
    button: string,
    selectItems?: FormSelectItem<any>[]
  ): Observable<string> {
    this.vcr = vcr;
    const factory = this.cfr.resolveComponentFactory(
      ModalComponent
    );
    const ref = factory.create(this.vcr.injector);

    (<InputModal>ref.instance).title = title;
    (<InputModal>ref.instance).body = body;
    (<InputModal>ref.instance).button = button;
    (<InputModal>ref.instance).type = type;

    if (type === ModalInputType.SELECT) {
      (<SelectModal>ref.instance).selectItems = selectItems;
    }

    setTimeout(() => this.vcr.insert(ref.hostView));

    return (<InputModal>ref.instance).destroy$.asObservable().pipe(
      take(1),
      tap(() => ref.destroy())
    );
  }

  openBulkEditModal(
    vcr: ViewContainerRef,
    selectedItems: unknown[],
    type: string,
  ): Observable<any> {
    this.vcr = vcr;
    let factory

    if (type === 'consignment') {
      factory = this.cfr.resolveComponentFactory(ConsignmentBulkEditorComponent);
    }
    if (type === 'order') {
      factory = this.cfr.resolveComponentFactory(OrderBulkEditorComponent);
    }

    const ref = factory.create(this.vcr.injector);
    ref.instance.selectedItems = selectedItems;

    setTimeout(() => this.vcr.insert(ref.hostView));

    return ref.instance.destroy$.asObservable().pipe(
      take(1),
      tap(() => ref.destroy())
    );
  }

  private static getTitle(type: ModalType, title?: string): string {
    switch (type) {
      case ModalType.DELETE:
        return 'modal.delete';
      case ModalType.FORM_DRAFT:
        return 'modal.load';
      default:
        return title;
    }
  }

  private static getBody(type: ModalType, body: string): string {
    switch (type) {
      case ModalType.DELETE:
        return 'modal.areYouSure';
      case ModalType.FORM_DRAFT:
        return 'modal.loadDraft';
      default:
        return body;
    }
  }
}
