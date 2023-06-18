import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { of } from 'rxjs';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { AssetsService } from './assets.service';

import { DocumentsComponent } from './documents.component';
import { NgxFilesizeModule } from 'ngx-filesize';

describe('DocumentsComponent', () => {
  let component: DocumentsComponent;
  let fixture: ComponentFixture<DocumentsComponent>;

  const assetsServiceMock = {
    getDocuments: () => of([] as AssetDto[]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsComponent],
      imports: [
        ClarityModule,
        NoopAnimationsModule,
        getTranslocoModule(),
        NgxFilesizeModule,
      ],
      providers: [
        {
          provide: AssetsService,
          useValue: assetsServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
