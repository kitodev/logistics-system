import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Configuration } from './Configuration';
import { catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private configuration: Observable<Configuration>;

  constructor(private http: HttpClient) {}

  public loadConfiguration(): Observable<Configuration> {
    if (!this.configuration) {
      this.configuration = this.http.get<Configuration>('config-staging.json').pipe(
        catchError(() => {
          return throwError(new Error('API Configuration error'));
        }),
        shareReplay(1)
      );
    }
    return this.configuration;
  }
}
