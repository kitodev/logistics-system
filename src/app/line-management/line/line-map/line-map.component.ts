import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { LineService } from '../../line.service';

import tt, { LngLat, LngLatBounds } from '@tomtom-international/web-sdk-maps';
import { TomTomService } from '../../../map/tom-tom.service';
import { MapComponent } from '../../../map/map/map.component';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons/faCrosshairs';
import { faRoute } from '@fortawesome/free-solid-svg-icons/faRoute';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';

export enum RouteTypes {
  LOGGED = 'LOGGED',
  PLANNED = 'PLANNED',
}

enum LoadType {
  UP = 'UP',
  DOWN = 'DOWN',
}

interface LineStation {
  premiseId: string;
  companyName: string;
  consignments: Array<{
    consignmentId: string;
    coordinates: LngLat;
    type: LoadType;
  }>;
}

@Component({
  selector: 'app-line-map',
  templateUrl: './line-map.component.html',
  styleUrls: ['./line-map.component.scss'],
})
export class LineMapComponent implements AfterViewInit, OnDestroy {
  lineId: string;
  lineLegs: Array<LegsOfLineDto> = [];
  isNew = false;

  private unsubscribe: Subject<void> = new Subject<void>();
  stations: Array<LngLat> = [];

  stats = {};

  colors: { [key in RouteTypes]?: string } = {
    PLANNED: '#346beb',
    LOGGED: '#f5348b',
  };

  @ViewChild('map')
  map: MapComponent;

  locations: Array<LngLat> = [];
  faCrosshairs = faCrosshairs;
  faRoute = faRoute;

  RouteTypes = RouteTypes;

  lineStations: Array<LineStation> = [];
  missingCoordinate = false;
  faExclamation = faExclamationCircle;

  constructor(
    private route: ActivatedRoute,
    private lineService: LineService,
    private tomTomService: TomTomService,
    private toastService: HotToastService,
    private translationService: TranslocoService
  ) {
    this.route.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.lineId = params.get('id') == 'new' ? null : params.get('id');
        this.isNew = !this.lineId;
      });
  }

  ngAfterViewInit(): void {
    combineLatest([
      this.lineService.getLegsByLineId(this.lineId),
      this.lineService.getLineHistory(this.lineId),
      this.map.loaded.pipe(filter((isLoaded) => isLoaded)),
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([legs, history]) => {
        this.addPlannedLine(legs);
        this.addLoggedLine(history);
      });
  }

  private addPlannedLine(legsOfLine: Array<LegsOfLineDto>): void {
    this.lineLegs = legsOfLine;
    this.lineStations = legsOfLine.map((leg) => ({
      premiseId: leg.premiseId,
      companyName: leg.companyName,
      consignments: leg.upConsignments
        .map((consignment) =>
          LineMapComponent.toConsignmentStation(consignment, LoadType.UP)
        )
        .concat(
          leg.downConsignments.map((consignment) =>
            LineMapComponent.toConsignmentStation(consignment, LoadType.DOWN)
          )
        ),
    }));
    this.addStationMarkers(this.lineStations);
    this.routePlanned(
      this.lineStations.reduce((acc, station) => {
        if (station.consignments[0]?.coordinates) {
          acc.push(station.consignments[0].coordinates);
        } else {
          this.missingCoordinate = true;
        }
        return acc;
      }, []),
      this.colors[RouteTypes.PLANNED],
      RouteTypes.PLANNED
    );
  }

  private static toConsignmentStation(
    consignment: ConsignmentOfLegDto,
    type: LoadType
  ): {
    consignmentId: string;
    coordinates: LngLat;
    type: LoadType;
  } {
    return {
      consignmentId: consignment.consignmentId,
      coordinates: consignment.coordinate
        ? new LngLat(consignment.coordinate.lon, consignment.coordinate.lat)
        : null,
      type,
    };
  }

  private addLoggedLine(history: LineLocationHistoryDto): void {
    const locations: Array<LngLat> = history?.locations.map((point) => {
      return new LngLat(point.coordinate.lon, point.coordinate.lat);
    });
    this.locations = locations;
    this.routeLocations(
      locations,
      this.colors[RouteTypes.LOGGED],
      RouteTypes.LOGGED
    );
    if (!history?.locations.length) {
      return;
    }
    const sorted = history.locations.sort((locationA, locationB) => {
      return (
        new Date(locationB.timestamp).getTime() -
        new Date(locationA.timestamp).getTime()
      );
    });

    this.addLastPositionMarker(sorted[0]);
  }

  private addLastPositionMarker(position: PositionDto): void {
    this.map.addPositionMarker(
      new LngLat(position.coordinate.lon, position.coordinate.lat),
      '⬤',
      `<h3>${this.translationService.translate(
        'map.lastPosition'
      )}</h3>${new Date(position.timestamp).toLocaleString()}`,
      this.colors[RouteTypes.LOGGED],
      this.colors[RouteTypes.LOGGED]
    );
  }

  private addStationMarkers(stations: Array<LineStation>) {
    const bounds = new LngLatBounds();
    stations.forEach((station, index) => {
      if (station.consignments[0].coordinates) {
        this.map.addPositionMarker(
          station.consignments[0].coordinates,
          (index + 1).toString(),
          `<h3>${station.companyName}</h3>`,
          this.colors[RouteTypes.PLANNED],
          this.colors[RouteTypes.PLANNED]
        );
        bounds.extend(station.consignments[0].coordinates);
      }
    });
    this.map.fit(bounds);
  }

  private routePlanned(
    locations: Array<LngLat>,
    color: string,
    layerId: RouteTypes
  ): void {
    if (locations.length < 2) {
      return;
    }
    this.tomTomService
      .routeWithWaypoints(locations)
      .pipe(
        this.toastService.observe({
          loading: this.translationService.translate('messages.routing'),
          success: this.translationService.translate('messages.routed'),
          error: this.translationService.translate('messages.routeError'),
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe((response) => {
        this.stats[layerId] = {
          time: response.routes[0]?.summary.travelTimeInSeconds,
          distance: response.routes[0]?.summary.lengthInMeters,
        };
        const hasLoggedLayer = !!this.map.getLayer(RouteTypes.LOGGED);

        const features = response.toGeoJson().features;
        for (let feature of features) {
          this.map.addRoute(
            feature,
            color,
            layerId,
            hasLoggedLayer ? RouteTypes.LOGGED : undefined
          );
        }

        const bounds = new LngLatBounds();
        locations.forEach((location) => {
          bounds.extend(location);
        });
        this.map.fit(bounds);
      });
  }

  private routeLocations(
    locations: Array<LngLat>,
    color: string,
    layerId: RouteTypes
  ): void {
    let supportingPoints: Array<LngLat>;
    if (locations.length > 3) {
      supportingPoints = locations.slice(1, locations.length - 1);
    }
    if (locations.length < 2) {
      return;
    }
    this.tomTomService
      .route(
        `${locations[0].lng},${locations[0].lat}`,
        `${locations[locations.length - 1].lng},${
          locations[locations.length - 1].lat
        }`,
        supportingPoints
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.stats[layerId] = {
          time: response.routes[0]?.summary.travelTimeInSeconds,
          distance: response.routes[0]?.summary.lengthInMeters,
        };

        const features = response.toGeoJson().features;
        for (let feature of features) {
          this.map.addRoute(feature, color, layerId);
        }

        const bounds = new LngLatBounds();

        features[0].geometry.coordinates.forEach((coordinate) => {
          bounds.extend(tt.LngLat.convert(coordinate));
        });
        this.map.fit(bounds);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
