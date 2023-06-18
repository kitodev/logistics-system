import { TranslocoConfig, TranslocoTestingModule } from '@ngneat/transloco';
import en from '../assets/i18n/en.json';
import hu from '../assets/i18n/hu.json';
import { ModuleWithProviders } from '@angular/core';

export function getTranslocoModule(
  config: Partial<TranslocoConfig> = {}
): ModuleWithProviders<TranslocoTestingModule> {
  return TranslocoTestingModule.forRoot({
    langs: { en, hu },
    translocoConfig: {
      availableLangs: ['en', 'hu'],
      defaultLang: 'en',
      ...config,
    },
  });
}
