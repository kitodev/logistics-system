import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCompanyComponent } from './my-company.component';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('MyCompanyComponent', () => {
  let component: MyCompanyComponent;
  let fixture: ComponentFixture<MyCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyCompanyComponent],
      imports: [ClarityModule, FontAwesomeTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
