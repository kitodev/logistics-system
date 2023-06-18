import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { getTranslocoModule } from 'src/test/transloco-module.spec';

import { NotificationOffersComponent } from './notification-offers.component';

describe('NotificationOffersComponent', () => {
  let component: NotificationOffersComponent;
  let fixture: ComponentFixture<NotificationOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ClarityModule,
        FontAwesomeTestingModule,
        RouterTestingModule,
        getTranslocoModule(),
      ],
      declarations: [ NotificationOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
