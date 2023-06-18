/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor';
import { APP_INITIALIZER, Injector } from '@angular/core';
import { Configuration } from '../shared/system/configuration/Configuration';
import { BEServiceConfig } from '../shared/system/configuration/config-for-generated-BEservices.service'


export function ConfigLoader(injector: Injector): () => Promise<Configuration> {
  return () => injector.get(BEServiceConfig).loadConfiguration();
}

/** Http interceptor providers in outside-in order */
export const basePathInterceptorProviders = [
  {
    provide: APP_INITIALIZER,
    useFactory: ConfigLoader,
    deps: [Injector],
    multi: true
  },
  {
    provide: BASE_PATH,
    useFactory: (service: BEServiceConfig) => service.config.apiUrl,
    deps: [BEServiceConfig]
  },
];
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];


