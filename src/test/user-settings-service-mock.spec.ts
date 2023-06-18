import { UserSettingsService } from 'src/app/shared/system/user-settings.service';

export const userSettingsServiceMock: Partial<UserSettingsService> = {
  getUserColumnSettings: () => ({}),
  saveUserColumnSettings: () => {},
  getUserColumnOrder: () => ([]),
  saveUserColumnOrder: () => {},
};

