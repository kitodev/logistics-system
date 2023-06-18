import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DateRangeFilterComponent } from './date-range-filter.component';
import { ClarityModule, ClrDatagridFilter } from '@clr/angular';

describe('DateRangeFilterComponent', () => {
  let component: DateRangeFilterComponent;
  let fixture: ComponentFixture<DateRangeFilterComponent>;
  const MockDatagridFilter = { setFilter: jasmine.createSpy('set filter') };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DateRangeFilterComponent],
        imports: [ClarityModule],
        providers: [
          { provide: ClrDatagridFilter, useValue: MockDatagridFilter },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
