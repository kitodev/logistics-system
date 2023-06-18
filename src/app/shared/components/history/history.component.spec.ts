import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { AuditService } from './audit.service';

import { HistoryComponent } from './history.component';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  const auditServiceMock = {
    getHistory: () => of(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoryComponent ],
      imports: [
        getTranslocoModule(),
      ],
      providers: [
        {
          provide: AuditService,
          useValue: auditServiceMock,
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
