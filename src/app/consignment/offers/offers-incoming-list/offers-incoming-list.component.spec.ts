import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OffersIncomingListComponent } from './offers-incoming-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { CommentService } from 'src/app/shared/components/comments/comment.service';
import { of } from 'rxjs';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { LogonModule } from 'src/app/logon.module';
import { EmployeeRoleDirective } from '../../../auth/employee-role.directive';

describe('OffersIncomingListComponent', () => {
  let component: OffersIncomingListComponent;
  let fixture: ComponentFixture<OffersIncomingListComponent>;

  const commentServiceMock = {
    getComments: () => of([] as CommentDto[]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OffersIncomingListComponent, EmployeeRoleDirective],
      providers: [
        {
          provide: CommentService,
          useValue: commentServiceMock,
        },
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        getTranslocoModule(),
        ClarityModule,
        FontAwesomeTestingModule,
        LogonModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersIncomingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
