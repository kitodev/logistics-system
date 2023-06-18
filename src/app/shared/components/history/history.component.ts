import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
  
  unsubscribe = new Subject<void>();

  @Input()
  aggregateIdType: string;
  @Input()
  aggregateId: string;
  @Input()
  component: Components;

  readonly propertiesNotNeeded = ['version', 'lastUpdated', 'createdAt'];

  list: Array<Change> = [];
  isLoading = true;

  constructor(
    private auditService: AuditService,
  ) { }

  ngOnInit(): void {
    this.auditService
    .getHistory(this.aggregateIdType, this.aggregateId)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((response) => {
      this.prepareList(response);
      this.isLoading = false;
    });
  }

  private prepareList(response: Array<HistoryItem>) {
    response.forEach((item) => {
      item.changes.forEach((change) => {
        if (!this.propertiesNotNeeded.includes(change.property)) {
          this.fixForTranslation(change);
          this.list.push(change);
        }
      })
    });
  }

  private fixForTranslation(change: Change): void {
    if (change.property === 'travelMode') {
      change.property = 'travelMode.label';
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}

export interface HistoryItem {
  changes: Array<Change>;
  commitMetadata: CommitMetadata;
}

export interface CommitMetadata {
  author: string;
  properties: [
    {
      key: string;
      value: string;
    }
  ],
  commitDate: string;
  commitDateInstant: string;
  id: number;
}

export interface Change {
  changeType: string;
  globalId: {
    entity: string;
    cdoId: string;
  },
  commitMetadata: CommitMetadata;
  property: string;
  propertyChangeType: string;
  left: string | number;
  right: string | number;
}

export enum Components {
  CONSIGNMENT = 'consignment',
  COMPANY = 'company',
}