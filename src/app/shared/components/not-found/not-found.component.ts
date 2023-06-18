import { Component, Input } from '@angular/core';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';

export enum NotFoundResourceTypes {
  COMPANY = 'COMPANY',
}

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  @Input()
  readonly type: NotFoundResourceTypes;
  @Input()
  readonly redirectUrl: string;

  faExclamation = faExclamation;

  constructor() {}
}
