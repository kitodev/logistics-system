import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LineComponent } from './line.component';
import { getTranslocoModule } from '../../../test/transloco-module.spec';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { LineService } from '../line.service';
import { lineServiceMock } from '../../../test/line-service-mock.spec';

describe('LineComponent', () => {
  let component: LineComponent;
  let fixture: ComponentFixture<LineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineComponent],
      imports: [
        RouterTestingModule,
        ClarityModule,
        FontAwesomeTestingModule,
        getTranslocoModule(),
      ],
      providers: [{ provide: LineService, useValue: lineServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
