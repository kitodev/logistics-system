import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { getTranslocoModule } from '../../test/transloco-module.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../auth/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          getTranslocoModule(),
          RouterTestingModule,
          HttpClientTestingModule,
          ClarityModule,
          FormsModule,
        ],
        providers: [AuthService],
        declarations: [LoginComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
