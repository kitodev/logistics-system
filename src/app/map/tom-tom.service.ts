import { Injectable, OnDestroy } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import tt, {
  BatchItem,
  BatchSummary,
  CalculateRouteOptions,
  GenericServiceResponse,
  StructuredGeocodeOptions,
} from '@tomtom-international/web-sdk-services';
import { LngLatLike } from '@tomtom-international/web-sdk-maps';
import { ConfigurationService } from '../shared/system/configuration/configuration.service';
import { takeUntil } from 'rxjs/operators';

export interface TomTomAddress {
  countryCode: string;
  city: string;
  streetName?: string;
  streetType?: string;
  postalCode?: string;
  streetNumber?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TomTomService implements OnDestroy {
  unsubscribe: Subject<void> = new Subject();
  key: string;

  constructor(private config: ConfigurationService) {
    this.config
      .loadConfiguration()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((config) => {
        this.key = config.tomtom;
      });
  }

  getKey() {
    return this.key;
  }

  geocode(address: TomTomAddress): Observable<GenericServiceResponse> {
    return from(
      tt.services.structuredGeocode({
        municipality: address.city,
        streetName: `${address.streetName} ${address.streetType}`,
        streetNumber: address.streetNumber,
        countryCode: address.countryCode,
        postalCode: address.postalCode,
        key: this.key,
        bestResult: true,
      } as StructuredGeocodeOptions)
    );
  }

  geocodeBatch(
    addresses: Array<TomTomAddress>
  ): Observable<{
    batchItems: BatchItem<GenericServiceResponse>[];
    summary: BatchSummary;
  }> {
    const items: Array<Omit<StructuredGeocodeOptions, 'key'>> = [];
    for (let address of addresses) {
      items.push({
        municipality: address.city,
        streetName: `${address.streetName} ${address.streetType}`,
        streetNumber: address.streetNumber,
        countryCode: address.countryCode,
        postalCode: address.postalCode,
        bestResult: true,
      });
    }

    return from(
      tt.services.structuredGeocode({
        key: this.key,
        batchMode: 'sync',
        batchItems: items,
      })
    );
  }

  route(
    source,
    destination,
    supportingPoints?: Array<LngLatLike>
  ): Observable<tt.CalculateRouteResponse> {
    const routeOptions: CalculateRouteOptions = {
      key: this.key,
      locations: `${source}:${destination}`,
      routeType: 'shortest',
      supportingPoints,
      travelMode: 'truck',
    };
    return from(tt.services.calculateRoute(routeOptions));
  }

  routeWithWaypoints(
    locations: Array<LngLatLike>
  ): Observable<tt.CalculateRouteResponse> {
    const routeOptions: CalculateRouteOptions = {
      key: this.key,
      locations: locations,
      routeType: 'shortest',
      travelMode: 'truck',
    };
    return from(tt.services.calculateRoute(routeOptions));
  }

  public static toTomTomAddress(address: AddressDto): TomTomAddress {
    return {
      city: address.city,
      countryCode: address.country,
      postalCode: address.postCode,
      streetName: address.streetName,
      streetNumber: address.streetNumber,
      streetType: address.streetType,
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
