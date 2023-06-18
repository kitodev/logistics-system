import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinanceType } from './form/financial-matrix.component';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  constructor(private financialEntriesBEService: FinancialEntriesBEService) { }

  getEntries(type: FinanceType, id: string): Observable<FinancialEntriesDto> {
    switch (type) {
      case FinanceType.CONSIGNMENT:
        return this.financialEntriesBEService.consignmentEntries(id);
      case FinanceType.LINE:
        return this.financialEntriesBEService.lineEntries(id);
    }
  }

  createEntry(type: FinanceType, id: string, entry: FinancialWriteEntryDto): Observable<unknown> {
    switch (type) {
      case FinanceType.CONSIGNMENT:
        return this.financialEntriesBEService.createConsignmentEntry(id, entry);
      case FinanceType.LINE:
        return this.financialEntriesBEService.createLineEntry(id, entry);
    }
  }

  updateEntry(type: FinanceType, id: string, entry: FinancialWriteEntryDto, entryId: string): Observable<unknown> {
    switch (type) {
      case FinanceType.CONSIGNMENT:
        return this.financialEntriesBEService.updateConsignmentEntry(id, entryId, entry);
      case FinanceType.LINE:
        return this.financialEntriesBEService.updateLineEntry(id, entryId, entry);
    }
  }

  deleteEntry(type: FinanceType, id: string, entryId: string): Observable<unknown> {
    switch (type) {
      case FinanceType.CONSIGNMENT:
        return this.financialEntriesBEService.removeConsignmentEntry(id, entryId);
      case FinanceType.LINE:
        return this.financialEntriesBEService.removeLineEntry(id, entryId);
    }
  }
}
