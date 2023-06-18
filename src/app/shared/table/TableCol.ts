import { ClrDatagridFilterInterface } from '@clr/angular';
import { FormSelectItem } from '../form/select/FormSelectItem';

export interface TableCol<T> {
  field: T;
  label: string;
  hidden?: boolean;
  filterType?: DataGridFilterType;
  filter?: ClrDatagridFilterInterface<unknown>;
  filterOptions?: FormSelectItem<any>[];
  sort?: boolean;
  filterValue?: string;
  operation?: DbFilterOperation;
}

export enum DataGridFilterType {
  NUMERIC = 'numeric',
  DATE = 'date',
  PICKER = 'picker',
  NOFILTER = 'nofilter',
}
