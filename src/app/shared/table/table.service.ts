import { Injectable } from '@angular/core';
import {
  ClrCommonStrings,
  ClrDatagridFilterInterface,
  ClrDatagridStateInterface,
} from '@clr/angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  public convertStateToQuery(state: ClrDatagridStateInterface): QueryDto {
    const query: QueryDto = {
      pageSize: state.page ? state.page.size : 10,
      pageNumber: state.page ? state.page.current - 1 : 0,
      sort: [
        {
          fieldName: 'id',
          direction: SortDtoDirection.ASC,
        },
      ],
      filters: [],
    };

    if (state.sort) {
      query.sort = [];
      if (state.sort.by == 'employeeName') {
        //TODO: move this into employee related file
        query.sort.push({
          fieldName: 'lastName',
          direction: state.sort.reverse
            ? SortDtoDirection.DESC
            : SortDtoDirection.ASC,
        });
        query.sort.push({
          fieldName: 'firstName',
          direction: state.sort.reverse
            ? SortDtoDirection.DESC
            : SortDtoDirection.ASC,
        });
      } else {
        query.sort.push({
          fieldName: state.sort.by as string,
          direction: state.sort.reverse
            ? SortDtoDirection.DESC
            : SortDtoDirection.ASC,
        });
      }
    }

    if (state.filters) {
      state.filters.forEach((filter) => {
        if (Array.isArray(filter)) {
          filter.forEach((f) => {
            if (f.property == 'employeeName') {
              query.filters.push({
                fieldName: 'lastName',
                operation: f.operation ?? DbFilterOperation.LIKE,
                filterValue: f.value,
              });
              query.filters.push({
                fieldName: 'firstName',
                operation: f.operation ?? DbFilterOperation.LIKE,
                filterValue: f.value,
              });
            } else {
              query.filters.push({
                fieldName: f.property,
                operation: f.operation ?? DbFilterOperation.LIKE,
                filterValue: f.value,
              });
            }
          });
        } else {
          if (filter.property == 'employeeName') {
            query.filters.push({
              fieldName: 'lastName',
              operation: filter.operation ?? DbFilterOperation.LIKE,
              filterValue: filter.value,
            });
            query.filters.push({
              fieldName: 'firstName',
              operation: filter.operation ?? DbFilterOperation.LIKE,
              filterValue: filter.value,
            });
          } else {
            query.filters.push({
              fieldName: filter.property,
              operation: filter.operation ?? DbFilterOperation.LIKE,
              filterValue: filter.value,
            });
          }
        }
      });
    }
    return query;
  }
}

export class CustomFilter implements ClrDatagridFilterInterface<string> {
  changes = new Subject<unknown>();
  state;
  value;

  isActive(): boolean {
    return !!this.state;
  }

  accepts(item: string): boolean {
    return true;
  }
}

//TODO finish translation ?
export const hunLocale: ClrCommonStrings = {
  filterItems: 'Szűrés',
  open: 'Megnyitás',
  close: 'Bezár',
  show: 'Mutat',
  hide: 'Elrejt',
  delete: 'Törlés',
  expand: 'Lenyit',
  collapse: 'Bezár',
  more: 'Több',
  select: 'Kiválaszt',
  selectAll: 'Összes kiválasztása',
  selection: 'hunLocale_selection',
  previous: 'Előző',
  next: 'Következő',
  current: 'Aktuális',
  info: 'hunLocale_info',
  success: 'hunLocale_success',
  warning: 'hunLocale_warning',
  danger: 'hunLocale_danger',
  rowActions: 'Műveletek',
  pickColumns: 'Oszlopok kiválasztása',
  showColumns: 'Oszlopok mutatása',
  sortColumn: 'Oszlopok rendezése',
  firstPage: 'Első oldal',
  lastPage: 'Utolsó oldal',
  previousPage: 'Előző oldal',
  nextPage: 'Következő oldal',
  currentPage: 'Aktuális oldal',
  totalPages: 'Összes oldal',
  minValue: 'Minimum érték',
  maxValue: 'Maximum érték',
  modalContentStart: 'hunLocale_modalContentStart',
  modalContentEnd: 'hunLocale_modalContentEnd',
  showColumnsMenuDescription: 'hunLocale_showColumnsMenuDescription',
  allColumnsSelected: 'hunLocale_allColumnsSelected',
  signpostToggle: 'hunLocale_signpostToggle',
  signpostClose: 'hunLocale_signpostClose',
  loading: 'Betöltés',
  detailPaneStart: 'hunLocale_detailPaneStart',
  detailPaneEnd: 'hunLocale_detailPaneEnd',
  singleSelectionAriaLabel: 'hunLocale_singleSelectionAriaLabel',
  singleActionableAriaLabel: 'hunLocale_singleActionableAriaLabel',
  detailExpandableAriaLabel: 'hunLocale_detailExpandableAriaLabel',
  alertCloseButtonAriaLabel: 'hunLocale_alertCloseButtonAriaLabel',
  /**
   * Datepicker UI labels
   */
  datepickerToggle: '',
  datepickerPreviousMonth: '',
  datepickerCurrentMonth: '',
  datepickerNextMonth: '',
  datepickerPreviousDecade: '',
  datepickerNextDecade: '',
  datepickerCurrentDecade: '',
  datepickerSelectMonthText: '',
  datepickerSelectYearText: '',
  /**
   * Stack View: Record has changed
   */
  stackViewChanged: '',
  verticalNavToggle: '',
  verticalNavGroupToggle: '',
  /**
   * Timeline Steps
   */
  timelineStepNotStarted: '',
  timelineStepCurrent: '',
  timelineStepSuccess: '',
  timelineStepError: '',
  timelineStepProcessing: '',
  /**
   * Combobox Searching Text
   */
  comboboxSearching: '',
  comboboxDelete: '',
  comboboxSelection: '',
  comboboxSelected: '',
  comboboxNoResults: '',
  comboboxOpen: '',
};
