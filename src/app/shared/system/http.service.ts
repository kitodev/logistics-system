import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import HttpStatus from 'http-status-codes';
import { AppRoutes } from './AppRoutes';
import { ConfigurationService } from './configuration/configuration.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private configuration: ConfigurationService
  ) {}

  get<T>(
    endpoint: string,
    params?: HttpParams | { [p: string]: string | string[] },
    responseType?: string
  ): Observable<T> {
    const options = {
      params: params,
    };

    if (responseType) {
      options['responseType'] = responseType;
    }

    return this.configuration.loadConfiguration().pipe(
      mergeMap((config) => {
        return this.http.get<T>(`${config.apiUrl}${endpoint}`, options);
      }),
      catchError((err) => {
        this.handleForbiddenError(err);
        return throwError(err);
      })
    );
  }

  post<T>(
    endpoint: string,
    data: unknown,
    responseType?: string
  ): Observable<T> {
    const options = {};
    if (responseType) {
      options['responseType'] = responseType;
    }

    return this.configuration.loadConfiguration().pipe(
      mergeMap((config) => {
        return this.http.post<T>(`${config.apiUrl}${endpoint}`, data, options);
      }),
      catchError((err) => {
        this.handleForbiddenError(err);
        return throwError(err);
      })
    );
  }

  postWithFullResponse<T>(
    endpoint: string,
    data: unknown
  ): Observable<HttpResponse<T>> {
    return this.configuration.loadConfiguration().pipe(
      mergeMap((config) => {
        return this.http.post<T>(`${config.apiUrl}${endpoint}`, data, {
          observe: 'response',
        });
      }),
      catchError((err) => {
        this.handleForbiddenError(err);
        return throwError(err);
      })
    );
  }

  put<T>(
    endpoint: string,
    data: unknown,
    params?: HttpParams | { [p: string]: string | string[] }
  ): Observable<T> {
    return this.configuration.loadConfiguration().pipe(
      mergeMap((config) => {
        return this.http.put<T>(`${config.apiUrl}${endpoint}`, data, {
          params: params,
        });
      }),
      catchError((err) => {
        this.handleForbiddenError(err);
        return throwError(err);
      })
    );
  }

  patch<T>(
    endpoint: string,
    data: unknown,
    params?: HttpParams | { [p: string]: string | string[] }
  ): Observable<T> {
    return this.configuration.loadConfiguration().pipe(
      mergeMap((config) => {
        return this.http.patch<T>(`${config.apiUrl}${endpoint}`, data, {
          params: params,
        });
      }),
      catchError((err) => {
        this.handleForbiddenError(err);
        return throwError(err);
      })
    );
  }

  delete<T>(endpoint: string, data: unknown): Observable<T> {
    return this.configuration.loadConfiguration().pipe(
      mergeMap((config) => {
        return this.http.delete<T>(`${config.apiUrl}${endpoint}/${data}`);
      }),
      catchError((err) => {
        this.handleForbiddenError(err);
        return throwError(err);
      })
    );
  }

  deleteWithBody<T>(endpoint: string, body: unknown): Observable<T> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body,
    };
    return this.configuration.loadConfiguration().pipe(
      mergeMap((config) => {
        return this.http.delete<T>(`${config.apiUrl}${endpoint}`, options);
      }),
      catchError((err) => {
        this.handleForbiddenError(err);
        return throwError(err);
      })
    );
  }

  private handleForbiddenError(err: HttpErrorResponse): void {
    if (
      err.status === HttpStatus.FORBIDDEN ||
      err.status === HttpStatus.UNAUTHORIZED
    ) {
      this.router.navigate(['/', AppRoutes.LOGIN]).then();
    } else {
      console.error(err);
    }
  }
}
