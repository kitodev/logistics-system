import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor(
    private auditBEService: AuditBEService,
  ) { }

  public getHistory(aggregateIdType: string, aggregateId: string): any {
    return this.auditBEService.listChanges(aggregateIdType, aggregateId)
  }
}
