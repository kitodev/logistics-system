import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { CreatePartnerComponent } from './create-partner.component';
import { ClarityModule } from '@clr/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

describe('CreatePartnerComponent', () => {
  let component: CreatePartnerComponent;
  let fixture: ComponentFixture<CreatePartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePartnerComponent],
      imports: [
        ClarityModule,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgOptionHighlightModule,
        getTranslocoModule(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
