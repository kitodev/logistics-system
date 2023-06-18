import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { LineConsignmentOrganizerComponent } from './line-consignment-organizer.component';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';

describe('LineConsignmentOrganizerComponent', () => {
  let component: LineConsignmentOrganizerComponent;
  let fixture: ComponentFixture<LineConsignmentOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineConsignmentOrganizerComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ClarityModule,
        FontAwesomeTestingModule,
        getTranslocoModule(),
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineConsignmentOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
