import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineLotsInfoComponent } from './line-lots-info.component';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('LineLotsInfoComponent', () => {
  let component: LineLotsInfoComponent;
  let fixture: ComponentFixture<LineLotsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineLotsInfoComponent],
      imports: [FontAwesomeTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineLotsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
