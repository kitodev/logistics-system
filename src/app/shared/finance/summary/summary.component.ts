import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-financial-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {

  @Input()
  financialEntries: FinancialEntriesDto;

}
