import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { getTranslocoModule } from 'src/test/transloco-module.spec';

import { NotificationPersonalComponent } from './notification-personal.component';

describe('NotificationPersonalComponent', () => {
  let component: NotificationPersonalComponent;
  let fixture: ComponentFixture<NotificationPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ClarityModule,
        FontAwesomeTestingModule,
        RouterTestingModule,
        getTranslocoModule(),
      ],
      declarations: [ NotificationPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
