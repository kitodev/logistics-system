import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { FormSelectItem } from '../../form/select/FormSelectItem';

export enum ModalInputType {
  INPUT,
  SELECT,
}

@Component({
  selector: 'ghbz-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  destroy$: Subject<boolean | string> = new Subject();

  open = true;
  title: string;
  body: string;
  item: string;
  button: string;
  inputValue: string;
  type: ModalInputType;
  selectItems: FormSelectItem<any>[];
  modalType = ModalInputType;

  clicked(result: boolean): void {
    this.open = false;
    this.destroy$.next(result);
  }

  send() {
    this.open = false;
    this.destroy$.next(this.inputValue);
  }
}

export interface ConfirmationModal {
  destroy$?: Subject<boolean>;
  open?: boolean;
  title?: string;
  body?: string;
  item?: string;
}

export interface InputModal {
  destroy$?: Subject<string>;
  open?: boolean;
  title?: string;
  body?: string;
  type?: ModalInputType;
  button?: string;
}

export interface SelectModal extends InputModal {
  selectItems: FormSelectItem<any>[];
}
