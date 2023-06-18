import { Component } from '@angular/core';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons/faBoxOpen';
import { faRoad } from '@fortawesome/free-solid-svg-icons/faRoad';

@Component({
  selector: 'app-line-organization',
  templateUrl: './line-organization.component.html',
  styleUrls: ['./line-organization.component.scss']
})
export class LineOrganizationComponent {
  faRoad = faRoad;
  faBoxOpen = faBoxOpen;
}
