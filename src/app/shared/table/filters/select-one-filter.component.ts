import { Component, Input } from '@angular/core';
import { ClrDatagridFilter, ClrDatagridFilterInterface } from '@clr/angular';
import { Observable, Subject } from 'rxjs';
import { FormSelectItem } from '../../form/select/FormSelectItem';

@Component({
  selector: 'table-select-one-filter',
  template: `
    <clr-select-container>
      <select clrSelect [(ngModel)]="selected">
        <option></option>
        <option *ngFor="let opt of options" value="{{ opt.value }}">
          {{ opt.label }}
        </option>
      </select>
    </clr-select-container>
  `,
})
export class SelectOneFilterComponent
  implements ClrDatagridFilterInterface<string> {
  constructor(private filterContainer: ClrDatagridFilter) {
    filterContainer.setFilter(this);
  }

  @Input() property: string;
  @Input() options: FormSelectItem<any>[];
  @Input() operation?: DbFilterOperation;

  get selected(): string {
    return this._selected;
  }

  set selected(value: string) {
    if (this._selected !== value) {
      this._selected = value;
      this._changes.next(this._selected);
    }
  }

  get value(): string {
    return this._selected;
  }

  set value(value: string) {
    this._selected = value;
    this._changes.next(this._selected);
  }

  private _changes = new Subject<string>();
  public get changes(): Observable<string> {
    return this._changes.asObservable();
  }

  public get state(): Array<{
    property: string;
    value: string;
    operation: DbFilterOperation;
  }> | null {
    const state: Array<{
      property: string;
      value: string;
      operation: DbFilterOperation;
    }> = [];
    const selectedState = this._selected
      ? {
          property: this.property,
          value: this._selected,
          operation: this.operation ? this.operation : DbFilterOperation.EQ,
        }
      : undefined;
    if (selectedState) {
      state.push(selectedState);
    }
    return state ?? null;
  }

  private _selected: string;

  isActive(): boolean {
    return !!this._selected;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accepts(value: string): boolean {
    return true;
  }
}
