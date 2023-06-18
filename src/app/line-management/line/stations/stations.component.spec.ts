import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { of } from 'rxjs';
import { getTranslocoModule } from 'src/test/transloco-module.spec';

import { StationsComponent } from './stations.component';

describe('StationsComponent', () => {
  let component: StationsComponent;
  let fixture: ComponentFixture<StationsComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationsComponent ],
      imports: [
        getTranslocoModule(),
        HttpClientTestingModule,
        RouterTestingModule,
        ClarityModule,
        FontAwesomeTestingModule,
      ],
      providers: [{ provide: ActivatedRoute, useValue: routeMock }],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
