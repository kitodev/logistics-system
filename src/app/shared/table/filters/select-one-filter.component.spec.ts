import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SelectOneFilterComponent } from './select-one-filter.component';
import { ClarityModule, ClrDatagridFilter } from '@clr/angular';

describe('SelectOneFilterComponent', () => {
  let component: SelectOneFilterComponent;
  let fixture: ComponentFixture<SelectOneFilterComponent>;
  const MockDatagridFilter = {
    setFilter: jasmine.createSpy('set filter'),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SelectOneFilterComponent],
        imports: [ClarityModule],
        providers: [
          { provide: ClrDatagridFilter, useValue: MockDatagridFilter },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOneFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
