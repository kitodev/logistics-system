import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { of } from 'rxjs';

import { LineDocumentsComponent } from './line-documents.component';

describe('LineDocumentsComponent', () => {
  let component: LineDocumentsComponent;
  let fixture: ComponentFixture<LineDocumentsComponent>;

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
      declarations: [ LineDocumentsComponent ],
      imports: [
        ClarityModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: routeMock,
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
