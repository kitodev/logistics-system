import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsListComponent } from './user-settings-list.component';
import { UserSettingsService } from '../../system/user-settings.service';
import { SettingsSections } from '../../system/local-storage.service';
import { userSettingsServiceMock } from 'src/test/user-settings-service-mock.spec';

describe('UserSettingsListComponent', () => {
  let component: UserSettingsListComponent;
  let fixture: ComponentFixture<UserSettingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSettingsListComponent],
      imports: [],
      providers: [
        { provide: SettingsSections, useValue: SettingsSections.EMPLOYEE },
        { provide: UserSettingsService, useValue: userSettingsServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
