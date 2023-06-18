import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import tt, {
  AnimationOptions,
  AnyLayer,
  LngLat,
  LngLatLike,
} from '@tomtom-international/web-sdk-maps';
import { ConfigurationService } from '../../shared/system/configuration/configuration.service';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { StationMarker } from '../../consignment/parcel-details/parcel-map/parcel-map.component';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements OnInit, OnDestroy {
  public loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private unsubscribe: Subject<void> = new Subject<void>();

  map: tt.Map;

  constructor(
    private configurationService: ConfigurationService,
    private translationService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.configurationService
      .loadConfiguration()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((config) => {
        this.map = tt.map({
          key: config.tomtom,
          container: 'map',
          zoom: 9,
        });
        this.map.addControl(new tt.NavigationControl());
        this.map.on('load', () => {
          this.loaded.next(true);
        });
      });
  }

  public panTo(
    lngLat: LngLatLike,
    options: AnimationOptions = { animate: false }
  ): void {
    this.map.panTo(lngLat, options);
  }

  public addLegMarker(
    lngLat: tt.LngLatLike,
    line: LegsOfLineDto,
    index: number
  ): void {
    if (lngLat instanceof LngLat) {
      this.addMarker(
        this.createMarkerElement(index.toString()),
        new LngLat(lngLat.lng, lngLat.lat),
        `<h3>${line.companyName}</h3><p>Lerakodás: ${line.downConsignments.length} küldemény</p><p>Felrakodás: ${line.upConsignments.length} küldemény</p>`
      );
    }
  }

  public addStationMarkers(stations: Array<StationMarker>): void {
    const bounds = new tt.LngLatBounds();
    stations.forEach((station, index) => {
      this.addMarker(
        this.createMarkerElement(station.markerSign),
        station.coordinate,
        this.getStationPopupContent(station)
      );
      bounds.extend(station.coordinate);
    });
    this.map.fitBounds(bounds, { duration: 1000, padding: 105 });
  }

  private getStationPopupContent(station: StationMarker): string {
    return `<h3>${this.translationService.translate(
      'map.locationType.' + station.type
    )}</h3>
<div>${station.address.country} ${station.address.postCode} ${
      station.address.city
    }</div>
<div>${station.address.streetName} ${station.address.streetType} ${
      station.address.streetNumber
    }</div>
`;
  }

  public addPositionMarker(
    position: LngLat,
    markerSign: string,
    content: string,
    borderColor?: string,
    color?: string
  ) {
    this.addMarker(
      this.createMarkerElement(markerSign, borderColor, color),
      position,
      content
    );
  }

  private addMarker(
    element: HTMLElement,
    position: LngLat,
    htmlText: string
  ): void {
    const popup = new tt.Popup({ offset: 30 })
      .setLngLat(position)
      .setHTML(htmlText);
    new tt.Marker({ element, anchor: 'bottom' })
      .setLngLat(position)
      .setPopup(popup)
      .addTo(this.map);
  }

  public createMarkerElement(
    sign: string,
    backgroundColor?: string,
    color?: string
  ): HTMLElement {
    const iconElement = document.createElement('div');
    iconElement.className = 'marker-icon';
    iconElement.innerHTML = sign;

    const markerContentElement = document.createElement('div');
    markerContentElement.className = 'marker-content';
    if (backgroundColor) {
      markerContentElement.style.backgroundColor = backgroundColor;
    }
    if (color) {
      markerContentElement.style.color = color;
    }
    markerContentElement.appendChild(iconElement);

    const markerElement: HTMLDivElement = document.createElement('div');
    markerElement.className = 'marker';
    markerElement.appendChild(markerContentElement);

    return markerElement;
  }

  public addRoute(data, color: string, id: string, before?: string) {
    this.map.addLayer(
      {
        id,
        type: 'line',
        source: {
          type: 'geojson',
          data: data,
        },
        paint: {
          'line-color': color,
          'line-width': 4,
        },
      },
      before
    );
  }

  getLayer(layerId: string): AnyLayer {
    return this.map.getLayer(layerId);
  }

  public hideLayer(layerId: string): void {
    //this.map.getStyle().Layer(layerId)
  }

  getBounds(coordinates: Array<LngLatLike>) {
    const bounds = new tt.LngLatBounds();
    coordinates.forEach(function (point) {
      bounds.extend(tt.LngLat.convert(point));
    });
    return bounds;
  }

  fit(bounds: tt.LngLatBounds) {
    this.map.fitBounds(bounds, { duration: 0, padding: 105 });
  }

  ngOnDestroy(): void {
    this.loaded.complete();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
