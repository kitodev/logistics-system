import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataGridFilterType, TableCol } from 'src/app/shared/table/TableCol';
import { LineService } from '../../line.service';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faTruckMoving } from '@fortawesome/free-solid-svg-icons/faTruckMoving';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { HttpErrorResponse } from '@angular/common/http';
import { faRoute } from '@fortawesome/free-solid-svg-icons/faRoute';
import {
  UserSettingsService,
} from '../../../shared/system/user-settings.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { CustomFilter } from 'src/app/shared/table/table.service';
import { UserSettingsListComponent } from '../../../shared/components/user-settings-list/user-settings-list.component';

interface DraggableLeg {
  legId?: string;
  lineId: string;
  chosenLineId?: string;
  consignmentId: string;
  locationFrom: LocationDto;
  locationTo: LocationDto;
}

enum ConsignmentTableHeaderFields {
  FROM = 'countryPair.from',
  TO = 'countryPair.to',
  COMPANYNAME = 'conveyor.companyName',
  TRANSPORT_MODE = 'transportMode',
  LICENSE_PLATE = 'activeVehicle.licensePlate',
  TRAILER_LICENSE_PLATE = 'trailer.trailerLicensePlate',
  VEHICLE_TYPE = 'activeVehicle.vehicleType',
  FULL_WEIGHT_TYPE = 'activeVehicle.fullWeightType',
  SUPER_STRUCTURE_TYPE = 'activeVehicle.superStructureType',
  LOADING_IN_COUNTRY = 'consignmentBasicData.loadingInLocation.premiseAddress.country',
  LOADING_OUT_COUNTRY = 'consignmentBasicData.loadingOutLocation.premiseAddress.country',
  LEGS = 'allLegs',
  LOADING_IN_CITY = 'consignmentBasicData.loadingInLocation.premiseAddress.city',
  LOADING_IN_TIMEGATE = 'consignmentBasicData.loadingInLocation.timeGate.earliestArrival',
  LOADING_OUT_TIMEGATE = 'consignmentBasicData.loadingOutLocation.timeGate.earliestArrival',
  LOADING_OUT_CITY = 'consignmentBasicData.loadingOutLocation.premiseAddress.city',
  CBM_SUB = 'cbmSum',
  WEIGHT_SUM = 'weightSum'
}

@Component({
  selector: 'app-line-consignment-organizer',
  templateUrl: './line-consignment-organizer.component.html',
  styleUrls: ['./line-consignment-organizer.component.scss'],
})
export class LineConsignmentOrganizerComponent
  implements OnInit, OnDestroy {
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faTruck = faTruckMoving;
  faTimes = faTimes;
  faExternalLink = faExternalLinkAlt;
  faRoute = faRoute;

  userSettings = {
    line: {},
    consignment: {},
  };

  private unsubscribe = new Subject<void>();
  isLoading = true;
  errors: HttpErrorResponse;
  legsChanged = false;
  DataGridFilterType = DataGridFilterType;
  transportModes: Array<FormSelectItem<TransportMode>>;
  ConsignmentTableHeaderFields = ConsignmentTableHeaderFields;

  linesTableCols: Array<TableCol<string>>;
  lineList: Array<
    LineContactVehiclesAndDriversDto & { allLegs?: Array<DraggableLeg> }
  > = [];
  legsToDelete: Array<string> = [];
  consignmentTableCols: Array<TableCol<string>>;
  consignments: Array<
    ConsignmentExtendedDto & {
      allLegs?: Array<DraggableLeg>;
      weightSum?: number;
      cbmSum?: number;
    }
  > = [];

  linesExpanded: Array<boolean> = [];
  consignmentsExpanded: Array<boolean> = [];

  constructor(
    private lineService: LineService,
    private consignmentService: ConsignmentBEService,
    translationService: TranslocoService,
    private userSettingsService: UserSettingsService,
    title: Title
  ) {
    translationService
      .selectTranslate('header.organize')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));

    this.userSettings.line = this.userSettingsService.getUserColumnSettings(
      SettingsSections.LINE_ORG
    );

    this.userSettings.consignment = this.userSettingsService.getUserColumnSettings(
      SettingsSections.CONSIGNMENT_ORG
    );
  }

  ngOnInit(): void {
    this.loadLegs();
  }

  loadLegs() {
    forkJoin([
      this.lineService.getLines({ pageSize: 100 }),
      this.consignmentService.findAllExtended({ pageSize: 100 }),
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([lines, consignments]) => {
        this.lineList = lines.content;
        this.consignments = consignments.content;

        this.prepareLineLegs();
        this.prepareConsignmentLegs();
        this.setUpTables();
        this.isLoading = false;
      });
  }

  private calculateSum(lots): [number, number] {
    return lots.reduce(
      (acc, item) => {
        return [
          Number(acc[0]) + Number(item.cbm),
          Number(acc[1]) + Number(item.weight),
        ];
      },
      [0, 0]
    );
  }

  save() {
    this.isLoading = true;
    if (this.legsToDelete.length > 0) {
      this.lineService
        .deleteLegOfLine(this.legsToDelete)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          () => {
            this.legsToDelete = [];
            this.saveNewOnes();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    } else {
      this.saveNewOnes();
    }
  }

  private saveNewOnes() {
    let legs: Array<LegDto> = [];
    this.lineList.forEach((line) => {
      line.allLegs.forEach((leg) => {
        if (!leg.lineId || (leg.chosenLineId && leg.chosenLineId != leg.lineId)) {
          legs.push({
            lineId: line.lineId,
            locationFromId: leg.locationFrom.id,
            locationToId: leg.locationTo.id,
          });
        }
      });
    });

    if (legs.length > 0) {
      this.lineService
        .addLegsToLine(legs)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.legsChanged = false;
            this.loadLegs();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    } else {
      this.legsChanged = false;
      this.loadLegs();
    }
  }

  private prepareConsignmentLegs(): void {
    this.consignments.forEach((consignment) => {
      consignment.allLegs = [];
      [consignment.cbmSum, consignment.weightSum] = this.calculateSum(
        consignment.consignmentBasicData.lots
      );

      if (consignment.transshipmentLocations.length) {
        consignment.transshipmentLocations.forEach((location, index) => {
          let currentLeg: DraggableLeg = {
            lineId: null,
            locationFrom: null,
            locationTo: null,
            consignmentId: consignment.consignmentId,
          };

          if (index == 0) {
            currentLeg.locationFrom =
              consignment.consignmentBasicData.loadingInLocation;
            currentLeg.locationTo = location;
          } else {
            currentLeg.locationFrom =
              consignment.allLegs[consignment.allLegs.length - 1].locationTo;
            currentLeg.locationTo = location;
          }

          const existingLeg = consignment.legs.find(
            (leg) =>
              leg.locationFromId == currentLeg.locationFrom.id &&
              leg.locationToId == currentLeg.locationTo.id
          );
          currentLeg.lineId = existingLeg?.lineId;
          currentLeg.legId = existingLeg?.id;

          consignment.allLegs.push(currentLeg);

          if (index == consignment.transshipmentLocations.length - 1) {
            const existingLeg = consignment.legs.find(
              (leg) =>
                leg.locationFromId == location.id &&
                leg.locationToId ==
                  consignment.consignmentBasicData.loadingOutLocation.id
            );
            consignment.allLegs.push({
              lineId: existingLeg?.lineId,
              legId: existingLeg?.id,
              consignmentId: consignment.consignmentId,
              locationFrom: location,
              locationTo: consignment.consignmentBasicData.loadingOutLocation,
            });
          }
        });
      } else {
        const existingLeg = consignment.legs.find(
          (leg) =>
            leg.locationFromId ==
              consignment.consignmentBasicData.loadingInLocation.id &&
            leg.locationToId ==
              consignment.consignmentBasicData.loadingOutLocation.id
        );
        consignment.allLegs.push({
          lineId: existingLeg?.lineId,
          legId: existingLeg?.id,
          consignmentId: consignment.consignmentId,
          locationFrom: consignment.consignmentBasicData.loadingInLocation,
          locationTo: consignment.consignmentBasicData.loadingOutLocation,
        });
      }
    });
  }

  private prepareLineLegs(): void {
    this.lineList.forEach((line) => {
      line.allLegs = [];
      line.legs.forEach((legOfLine) => {
        line.allLegs.push({
          consignmentId: legOfLine.consignment.consignmentId,
          legId: legOfLine.id,
          lineId: line.lineId,
          locationFrom: legOfLine.fromLocation,
          locationTo: legOfLine.toLocation,
        });
      });
    });
  }

  private setUpTables(): void {
    this.linesTableCols = this.linesTableCols ?? [
      { field: ConsignmentTableHeaderFields.FROM,
        label: 'lines.start' 
      },
      { field: ConsignmentTableHeaderFields.TO,
        label: 'lines.arrival' 
      },
      { field: ConsignmentTableHeaderFields.COMPANYNAME,
        label: 'lines.conveyorCompany' 
      },
      { field: ConsignmentTableHeaderFields.TRANSPORT_MODE,
        label: 'lines.transportMode',
      },
      {
        field: ConsignmentTableHeaderFields.LICENSE_PLATE,
        label: 'company.vehicle.licensePlate',
      },
      { field: ConsignmentTableHeaderFields.TRAILER_LICENSE_PLATE,
        label: 'lines.trailerPlate' 
      },
      {
        field: ConsignmentTableHeaderFields.VEHICLE_TYPE,
        label: 'company.vehicle.vehicleType',
      },
      {
        field: ConsignmentTableHeaderFields.FULL_WEIGHT_TYPE,
        label: 'company.vehicle.fullWeight',
      },
      {
        field: ConsignmentTableHeaderFields.SUPER_STRUCTURE_TYPE,
        label: 'company.vehicle.superStructure',
      },
    ];
    this.linesTableCols.map((col) => {
      col.hidden = this.userSettings.line[col.field];
      return col;
    });

    this.consignmentTableCols = this.consignmentTableCols ?? [
      {
        field: ConsignmentTableHeaderFields.LOADING_IN_COUNTRY,
        label: 'consignment.loadingIn.address',
      },
      {
        field: ConsignmentTableHeaderFields.LOADING_IN_COUNTRY,
        label: 'consignment.loadingOut.address',
      },
      { field: ConsignmentTableHeaderFields.LEGS, 
        label: 'lines.leg' 
      },
      {
        field: ConsignmentTableHeaderFields.LOADING_IN_CITY,
        label: 'consignment.loadingIn.label',
      },
      {
        field: ConsignmentTableHeaderFields.LOADING_IN_TIMEGATE,
        label: 'consignment.loadingIn.time',
      },
      {
        field: ConsignmentTableHeaderFields.LOADING_OUT_CITY,
        label: 'consignment.loadingOut.label',
      },
      {
        field: ConsignmentTableHeaderFields.LOADING_OUT_TIMEGATE,
        label: 'consignment.loadingOut.time',
      },
      {
        field: ConsignmentTableHeaderFields.CBM_SUB,
        label: 'consignment.lot.allCbm',
      },
      {
        field: ConsignmentTableHeaderFields.WEIGHT_SUM,
        label: 'consignment.lot.allWeight',
      },
    ];
    this.consignmentTableCols.map((col) => {
      col.hidden = this.userSettings.consignment[col.field];
      return col;
    });
  }

  changeConsignmentColumnHidden(hidden: boolean, field: string): void {
    this.userSettings.consignment[field] = hidden;
    this.userSettingsService.saveUserColumnSettings(
      SettingsSections.CONSIGNMENT_ORG,
      this.userSettings.consignment
    );
  }

  changeLineColumnHidden(hidden: boolean, field: string): void {
    this.userSettings.line[field] = hidden;
    this.userSettingsService.saveUserColumnSettings(
      SettingsSections.LINE_ORG,
      this.userSettings.line
    );
  }

  removeLeg(leg): void {
    let lineIndex: number;
    this.legsChanged = true;

    if (leg.lineId) {
      this.legsToDelete.push(leg.legId);
      lineIndex = this.lineList.findIndex((line) => line.lineId == leg.lineId);
    } else {
      lineIndex = this.lineList.findIndex(
        (line) => line.lineId == leg.chosenLineId
      );
    }
    const legIndex = this.lineList[lineIndex].allLegs.findIndex(
      (lineLeg) => lineLeg == leg
    );
    this.lineList[lineIndex].allLegs.splice(legIndex, 1);

    const consignmentIndex = this.consignments.findIndex(
      (consignment) => consignment.consignmentId == leg.consignmentId
    );
    const consLegIndex = this.consignments[consignmentIndex].allLegs.findIndex(
      (consignmentLeg) =>
        consignmentLeg.locationFrom.id == leg.locationFrom.id &&
        consignmentLeg.locationTo.id == leg.locationTo.id
    );
    this.consignments[consignmentIndex].allLegs[consLegIndex].lineId = null;
    this.consignments[consignmentIndex].allLegs[
      consLegIndex
    ].chosenLineId = null;
  }

  onLineDrop(event: CdkDragDrop<DraggableLeg[]>) {
    this.legsChanged = true;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (
        !event.container.data.includes(
          event.previousContainer.data[event.previousIndex]
        )
      ) {
        if (!event.previousContainer.sortingDisabled) {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this.legsToDelete.push(event.container.data[event.currentIndex].legId);
        } else {
          copyArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        }
        event.container.data[event.currentIndex]['chosenLineId'] =
          event.container.id;
      }
    }
  }

  canDrop(): boolean {
    return false;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
