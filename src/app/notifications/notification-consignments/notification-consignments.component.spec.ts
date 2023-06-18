import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { of } from 'rxjs';
import { StatusesComponent } from 'src/app/statuses/statuses.component';
import { getTranslocoModule } from 'src/test/transloco-module.spec';

import { NotificationConsignmentsComponent } from './notification-consignments.component';

describe('NotificationConsignmentsComponent', () => {
  let component: NotificationConsignmentsComponent;
  let fixture: ComponentFixture<NotificationConsignmentsComponent>;
  const statusesComponentMock: Partial<StatusesComponent> = {
    faultyConsignments: of([]),
  };
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ClarityModule,
        FontAwesomeTestingModule,
        RouterTestingModule,
        getTranslocoModule(),
      ],
      declarations: [ NotificationConsignmentsComponent ],
      providers: [
        { provide: StatusesComponent, useValue: statusesComponentMock },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationConsignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
