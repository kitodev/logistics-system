import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from './Configuration';
@Injectable({
  providedIn: 'root'
})
export class BEServiceConfig {
  private configData: Configuration | undefined;
  constructor(
    private http: HttpClient
  ) { }

  async loadConfiguration(): Promise<Configuration> {
    try {
      if (!this.configData) {
        const response = await this.http.get<Configuration>('config-staging.json')
          .toPromise();
        this.configData = response;
        return this.configData;
      }
      return this.configData;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  get config(): Configuration | undefined {
    return this.configData;
  }
}