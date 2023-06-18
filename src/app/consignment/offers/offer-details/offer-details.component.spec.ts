import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferDetailsComponent } from './offer-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('OfferDetailsComponent', () => {
  let component: OfferDetailsComponent;
  let fixture: ComponentFixture<OfferDetailsComponent>;
  const routeMock = {
    snapshot: {},
    paramMap: of({
      get(name: string): string | null {
        if (name == 'id') {
          return '1234';
        }
        return null;
      },
    }),
    parent: {
      paramMap: of({
        keys: ['id'],
        get(name: string): string | null {
          if (name == 'id') {
            return '1234';
          }
          return null;
        },
        getAll(): string[] {
          return [];
        },
        has(name: string): boolean {
          return name === 'id';
        },
      }),
    },
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientTestingModule,
          ClarityModule,
          FontAwesomeTestingModule,
          getTranslocoModule(),
        ],
        declarations: [OfferDetailsComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: routeMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
