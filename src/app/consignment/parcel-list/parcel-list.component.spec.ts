import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ParcelListComponent } from './parcel-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { of } from 'rxjs';
import { AddressPipe } from '../../shared/pipes/address.pipe';
import { LineService } from 'src/app/line-management/line.service';
import { CommentService } from 'src/app/shared/components/comments/comment.service';
import { AuthService } from 'src/app/auth/auth.service';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { authServiceMock } from '../../../test/auth-service-mock.spec';
import { consignmentServiceMock } from '../../../test/consignment-service-mock.spec';
import { lineServiceMock } from '../../../test/line-service-mock.spec';

describe('ParcelListComponent', () => {
  let component: ParcelListComponent;
  let fixture: ComponentFixture<ParcelListComponent>;

  const commentServiceMock = {
    getComments: () => of([] as CommentDto[]),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ParcelListComponent, AddressPipe],
        imports: [
          RouterTestingModule,
          FormsModule,
          ReactiveFormsModule,
          FontAwesomeTestingModule,
          ClarityModule,
          getTranslocoModule(),
        ],
        providers: [
          {
            provide: ConsignmentBEService,
            useValue: consignmentServiceMock,
          },
          {
            provide: LineService,
            useValue: lineServiceMock,
          },
          {
            provide: CommentService,
            useValue: commentServiceMock,
          },
          {
            provide: AuthService,
            useValue: authServiceMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelListComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
