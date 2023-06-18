import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-offer-deadline',
  templateUrl: './offer-deadline.component.html',
  styleUrls: ['./offer-deadline.component.scss'],
})
export class OfferDeadlineComponent {
  @Input()
  deadline: string;
  @Input()
  disabled: boolean;
  @Output()
  onDeadlineChange: EventEmitter<string> = new EventEmitter<string>();

  deadlineChanged(deadline: string): void {
    this.onDeadlineChange.emit(deadline);
  }
}
