import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from '@clr/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FaultyConsignmentsComponent } from './faulty-consignments.component';
import { StatusesComponent } from '../statuses.component';
import { of } from 'rxjs';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('FaultyConsignmentsComponent', () => {
  let component: FaultyConsignmentsComponent;
  let fixture: ComponentFixture<FaultyConsignmentsComponent>;
  const statusesComponentMock: Partial<StatusesComponent> = {
    faultyConsignments: of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaultyConsignmentsComponent],
      imports: [
          ReactiveFormsModule,
          HttpClientTestingModule,
          ClarityModule,
          FontAwesomeTestingModule,
          RouterTestingModule,
          getTranslocoModule(),
      ],
      providers: [
        { provide: StatusesComponent, useValue: statusesComponentMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaultyConsignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
