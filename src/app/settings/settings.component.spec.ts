import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { authServiceMock } from 'src/test/auth-service-mock.spec';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { AuthService } from '../auth/auth.service';

import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ SettingsComponent ],
        imports: [
          getTranslocoModule(),
          HttpClientTestingModule,
          RouterTestingModule,
          FormsModule,
          ReactiveFormsModule,
        ],
        providers: [{ provide: AuthService, useValue: authServiceMock }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
