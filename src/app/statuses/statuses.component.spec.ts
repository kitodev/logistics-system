import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusesComponent } from './statuses.component';
import { getTranslocoModule } from '../../test/transloco-module.spec';
import { StatusesService } from './statuses.service';
import { Observable, of } from 'rxjs';

describe('StatusesComponent', () => {
  let component: StatusesComponent;
  let fixture: ComponentFixture<StatusesComponent>;
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
      declarations: [StatusesComponent],
      imports: [getTranslocoModule()],
      providers: [{ provide: StatusesService, useValue: statusesServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
