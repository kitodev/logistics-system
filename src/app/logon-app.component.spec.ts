import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LogonAppComponent } from './logon-app.component';
import { getTranslocoModule } from '../test/transloco-module.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { ClarityModule } from '@clr/angular';

describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          getTranslocoModule(),
          HttpClientTestingModule,
          FontAwesomeTestingModule,
          ClarityModule,
        ],
        declarations: [LogonAppComponent],
      }).compileComponents();
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(LogonAppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
