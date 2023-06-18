import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsListComponent } from './locations-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { getTranslocoModule } from '../../../../../test/transloco-module.spec';

describe('LocationsListComponent', () => {
  let component: LocationsListComponent;
  let fixture: ComponentFixture<LocationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        getTranslocoModule(),
        ReactiveFormsModule,
        FormsModule,
        FontAwesomeTestingModule,
      ],
      declarations: [LocationsListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
