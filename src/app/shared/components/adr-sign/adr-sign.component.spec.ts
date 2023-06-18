import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdrSignComponent } from './adr-sign.component';

describe('AdrSignComponent', () => {
  let component: AdrSignComponent;
  let fixture: ComponentFixture<AdrSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdrSignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdrSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
