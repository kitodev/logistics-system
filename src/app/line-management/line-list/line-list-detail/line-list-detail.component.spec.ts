import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineListDetailComponent } from './line-list-detail.component';
import { LineService } from '../../line.service';
import { lineServiceMock } from '../../../../test/line-service-mock.spec';

describe('LineListDetailComponent', () => {
  let component: LineListDetailComponent;
  let fixture: ComponentFixture<LineListDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineListDetailComponent],
      providers: [{ provide: LineService, useValue: lineServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
