import { Component } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faRoad } from '@fortawesome/free-solid-svg-icons/faRoad';

@Component({
  selector: 'app-line-management',
  templateUrl: './line-management.component.html',
  styleUrls: ['./line-management.component.scss']
})
export class LineManagementComponent {
  faPlus = faPlus;
  faRoad = faRoad;
}