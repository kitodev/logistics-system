import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParcelAddressDataComponent } from './parcel-address-data.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';

describe('ParcelAddressDataComponent', () => {
  let component: ParcelAddressDataComponent;
  let fixture: ComponentFixture<ParcelAddressDataComponent>;
  const routeMock = {
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
          HttpClientTestingModule,
          RouterTestingModule,
          ReactiveFormsModule,
          FormsModule,
          getTranslocoModule(),
        ],
        declarations: [ParcelAddressDataComponent],
        providers: [
          { provide: ActivatedRoute, useValue: routeMock },
          {
            provide: AuthService,
            useValue: authServiceMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelAddressDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
