import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { of } from 'rxjs';
import { StatusesComponent } from 'src/app/statuses/statuses.component';
import { getTranslocoModule } from 'src/test/transloco-module.spec';

import { NotificationLinesComponent } from './notification-lines.component';

describe('NotificationLinesComponent', () => {
  let component: NotificationLinesComponent;
  let fixture: ComponentFixture<NotificationLinesComponent>;
  const statusesComponentMock: Partial<StatusesComponent> = {
    faultyStations: of([]),
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
      declarations: [ NotificationLinesComponent ],
      providers: [
        { provide: StatusesComponent, useValue: statusesComponentMock },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
