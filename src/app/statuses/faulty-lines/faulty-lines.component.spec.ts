import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from '@clr/angular';
import { FaultyLinesComponent } from './faulty-lines.component';
import { StatusesComponent } from '../statuses.component';
import { of } from 'rxjs';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { getTranslocoModule } from 'src/test/transloco-module.spec';

describe('FaultyLinesComponent', () => {
  let component: FaultyLinesComponent;
  let fixture: ComponentFixture<FaultyLinesComponent>;
  const statusesComponentMock: Partial<StatusesComponent> = {
    faultyStations: of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaultyLinesComponent],
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
    fixture = TestBed.createComponent(FaultyLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
