import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MapComponent } from '../../../map/map/map.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { filter, map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { of, Subject, zip } from 'rxjs';
import { CompanyService } from '../../../clients/company.service';
import { LngLat, LngLatBounds } from '@tomtom-international/web-sdk-maps';
import { TomTomService } from '../../../map/tom-tom.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { RouteLeg } from '@tomtom-international/web-sdk-services';
import { LocationType } from '../LocationType';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { LineService } from '../../../line-management/line.service';
import { ParcelMapService } from './parcel-map.service';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';

export interface StationMarker {
  markerSign: string;
  address: AddressDto;
  coordinate: LngLat;
  type: LocationType;
}

@Component({
  selector: 'app-parcel-map',
  templateUrl: './parcel-map.component.html',
  styleUrls: ['./parcel-map.component.scss'],
})
export class ParcelMapComponent implements AfterViewInit {
  private unsubscribe: Subject<void> = new Subject<void>();

  @ViewChild('map')
  map: MapComponent;

  partners: Map<string, CompanyDto> = new Map<string, CompanyDto>();
  consignment: ConsignmentDto;
  locations: Array<LocationDto> = [];
  stats = {};
  legs: Array<RouteLeg> = [];
  planError = false;
  faExclamation = faExclamationCircle;
  routed = false;
  lineLegs: Array<LegDto>;
  faExternalLinkAlt = faExternalLinkAlt;
  currentPosition: CoordinateDto;

  constructor(
    private route: ActivatedRoute,
    private consignmentService: ConsignmentBEService,
    private companyService: CompanyService,
    private lineService: LineService,
    private tomTomService: TomTomService,
    private toastService: HotToastService,
    private translationService: TranslocoService,
    private parcelMapService: ParcelMapService
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      zip(
        this.route.parent.paramMap.pipe(
          filter((params) => !!params.get('id')),
          map((params: ParamMap) => params.get('id')),
          mergeMap((consignmentId) =>
            zip(
              this.consignmentService.findConsignemntById(consignmentId).pipe(
                tap((consignment) => {
                  this.consignment = consignment;
                }),
                map((consignment) =>
                  ParcelMapService.getLocationsLegs(consignment)
                ),
                tap(([locations]) => {
                  this.locations = locations;
                })
              ),
              this.consignmentService
                .consignmentStatuses(consignmentId)
                .pipe(
                  map((statuses) => ParcelMapService.filterLastStatus(statuses))
                )
            )
          ),
          mergeMap(([[locations, legs], status]) => {
            this.lineLegs = legs;
            return zip(
              of(ParcelMapService.locationsToMarkers(locations)),
              this.parcelMapService.statusToCoordinates(locations, legs, status)
            );
          })
        ),
        this.companyService.getProcessedPartners(),
        this.map.loaded.pipe(filter((isLoaded) => isLoaded))
      )
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(([[markers, currentPosition], partners]) => {
          partners.forEach((partner) => {
            this.partners.set(partner.id, partner);
          });

          this.map.addStationMarkers(markers);
          this.currentPosition = currentPosition;
          if (currentPosition) {
            this.map.addPositionMarker(
              new LngLat(currentPosition.lon, currentPosition.lat),
              'o',
              this.translationService.translate('consignment.currentPosition'),
              '#68c71a',
              '#68c71a'
            );
          }

          this.routeStations(
            markers.map((marker) => marker.coordinate),
            '#ff4177'
          );
        });
    }, 0);
  }

  private routeStations(locations: Array<LngLat>, color: string) {
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
      .subscribe(
        (response) => {
          this.stats['PLAN'] = {
            time: response.routes[0]?.summary.travelTimeInSeconds,
            distance: response.routes[0]?.summary.lengthInMeters,
          };
          this.routed = true;
          this.legs = response.routes[0].legs;
          const features = response.toGeoJson().features;
          for (let feature of features) {
            this.map.addRoute(feature, color, 'PLAN');
          }

          const bounds = new LngLatBounds();
          
          locations.forEach((location) => {
            bounds.extend(location);
          });
          this.map.fit(bounds);
        },
        (error) => {
          this.planError = true;
          console.error(error);
        }
      );
  }

  locate(coordinate: CoordinateDto) {
    this.map.panTo(new LngLat(coordinate.lon, coordinate.lat), {
      animate: true,
      duration: 600,
    });
  }
}
