import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoModule } from 'src/test/transloco-module.spec';

import { NotificationsComponent } from './notifications.component';
import { Observable, of } from 'rxjs';
import { StatusesComponent } from '../statuses/statuses.component';
import { StatusesService } from '../statuses/statuses.service';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  const statusesServiceMock: Partial<StatusesService> = {
    getFaultyLineStations(): Observable<Array<FaultyLineStationDto>> {
      return of([]);
    },
    getFaultyConsignments(): Observable<Array<FaultyConsignmentDto>> {
      return of([]);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        getTranslocoModule(),
      ],
      declarations: [ NotificationsComponent ],
      providers: [
        {provide: StatusesService, useValue: statusesServiceMock}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
