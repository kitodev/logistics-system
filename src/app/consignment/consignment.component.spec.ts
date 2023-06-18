import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsignmentComponent } from './consignment.component';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('ConsignmentComponent', () => {
  let component: ConsignmentComponent;
  let fixture: ComponentFixture<ConsignmentComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ConsignmentComponent],
        imports: [ClarityModule, FontAwesomeTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
