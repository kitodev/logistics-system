import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactListComponent } from './contact-list.component';
import { CompanyService } from '../company.service';
import { AuthService } from 'src/app/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { of } from 'rxjs';
import { CommentService } from 'src/app/shared/components/comments/comment.service';
import { getTranslocoModule } from '../../../test/transloco-module.spec';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { companyServiceMock } from '../../../test/company-service-mock.spec';
import { authServiceMock } from '../../../test/auth-service-mock.spec';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;

  const commentServiceMock = {
    getComments: () => of([] as CommentDto[]),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContactListComponent],
        imports: [
          RouterTestingModule,
          ClarityModule,
          FontAwesomeTestingModule,
          getTranslocoModule(),
        ],
        providers: [
          {
            provide: CompanyService,
            useValue: companyServiceMock,
          },
          {
            provide: AuthService,
            useValue: authServiceMock,
          },
          {
            provide: CommentService,
            useValue: commentServiceMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
