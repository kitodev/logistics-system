import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ParcelDetailsComponent } from './parcel-details.component';
import { getTranslocoModule } from '../../../test/transloco-module.spec';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('ParcelDetailsComponent', () => {
  let component: ParcelDetailsComponent;
  let fixture: ComponentFixture<ParcelDetailsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ParcelDetailsComponent],
        imports: [
          RouterTestingModule,
          getTranslocoModule(),
          ClarityModule,
          FontAwesomeTestingModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
