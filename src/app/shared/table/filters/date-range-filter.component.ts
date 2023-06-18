import { Component, Input } from '@angular/core';
import { ClrDatagridFilter, ClrDatagridFilterInterface } from '@clr/angular';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'table-date-range-filter',
  template: `
    <input clrInput type="datetime-local" [(ngModel)]="fromDatetime" />
    <input clrInput type="datetime-local" [(ngModel)]="toDatetime" />
  `,
})
export class DateRangeFilterComponent
  implements ClrDatagridFilterInterface<[string, string]> {
  constructor(private filterContainer: ClrDatagridFilter) {
    filterContainer.setFilter(this);
  }

  @Input() property: string;

  //TODO datepicker + clear filter
  //TODO correct format : (value + ':00.000000+02:00')

  get toDatetime(): string {
    return this._toDatetime;
  }

  set toDatetime(value: string) {
    if (this._toDatetime !== value) {
      this._toDatetime = value;
      this._changes.next([this._fromDatetime, this._toDatetime]);
    }
  }

  get fromDatetime(): string {
    return this._fromDatetime;
  }

  set fromDatetime(value: string) {
    if (this._fromDatetime !== value) {
      this._fromDatetime = value;
      this._changes.next([this._fromDatetime, this._toDatetime]);
    }
  }

  get value(): [string, string] {
    return [this._fromDatetime, this._toDatetime];
  }

  set value(value: [string, string]) {
    this._fromDatetime = value[0];
    this._toDatetime = value[1];
    this._changes.next([this._fromDatetime, this._toDatetime]);
  }

  private _changes = new Subject<[string, string]>();
  public get changes(): Observable<[string, string]> {
    return this._changes.asObservable();
  }

  public get state(): Array<{
    property: string;
    value: string;
    operation: DbFilterOperation;
  }> {
    const state = [];
    const fromState = this._fromDatetime
      ? {
          property: this.property,
          value: this._fromDatetime,
          operation: DbFilterOperation.GT,
        }
      : undefined;
    const toState = this._toDatetime
      ? {
          property: this.property,
          value: this._toDatetime,
          operation: DbFilterOperation.LT,
        }
      : undefined;
    if (fromState) {
      state.push(fromState);
    }
    if (toState) {
      state.push(toState);
    }
    return state ?? null;
  }

  private _fromDatetime: string;
  private _toDatetime: string;

  isActive(): boolean {
    return !!this._fromDatetime || !!this._toDatetime;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accepts(value: [string, string]): boolean {
    return true;
  }
}
