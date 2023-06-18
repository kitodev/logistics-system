import { Component, OnInit } from '@angular/core';
import { LineService } from '../../line.service';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { forkJoin, from, Subject } from 'rxjs';
import { faTruckLoading } from '@fortawesome/free-solid-svg-icons/faTruckLoading';
import { CompanyService } from '../../../clients/company.service';
import { ConsignmentDirection } from './line-lots-info/line-lots-info.component';
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint';
import { PopoutService } from 'src/app/shared/popout/popout.service';
import { PopoutModalName } from 'src/app/shared/popout/PopoutModalData';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-line-consignments',
  templateUrl: './line-consignments.component.html',
  styleUrls: ['./line-consignments.component.scss'],
})
export class LineConsignmentsComponent implements OnInit {
  unsubscribe: Subject<void> = new Subject<void>();
  lineId: string;
  lineData: LineContactVehiclesAndDriversDto;
  legs: Array<LegsOfLineDto>;
  consignmentsById: Map<string, ConsignmentDto> = new Map();
  companies: Map<string, CompanyDto> = new Map();
  ConsignmentDirection = ConsignmentDirection;

  faTruckLoading = faTruckLoading;
  faPrint = faPrint;

  constructor(
    private companyService: CompanyService,
    private lineService: LineService,
    private route: ActivatedRoute,
    private popoutService: PopoutService,
    private translationService: TranslocoService,
  ) {
    this.route.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.lineId = params.get('id') == 'new' ? null : params.get('id');
      });
  }

  ngOnInit(): void {
    if (!this.lineId) return;
    const query: QueryDto = {
      filters: [
        {
          filterValue: this.lineId,
          fieldName: 'lineId',
          operation: DbFilterOperation.EQ,
        },
      ],
      pageSize: 5,
      pageNumber: 0,
    };
    this.lineService
      .getLegsByLineId(this.lineId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((legs) => {
        this.legs = legs;
      });

    this.lineService
      .getLines(query)
      .pipe(
        map((pagedResponse) => pagedResponse.content),
        takeUntil(this.unsubscribe)
      )
      .subscribe((lines) => {
        if (lines.length < 1) {
          return;
        }
        this.lineData = lines[0];

        this.consignmentsById.clear();
        forkJoin([
          from(
            this.lineData.legs.reduce((companyIds, leg) => {
              this.consignmentsById.set(leg.consignment.id, leg.consignment);
              companyIds.add(
                leg.consignment.consignmentBasicData.loadingInLocation.sender
              );
              companyIds.add(
                leg.consignment.consignmentBasicData.loadingOutLocation.sender
              );
              return companyIds;
            }, new Set<string>())
          ).pipe(
            mergeMap((companyId) => this.companyService.getCompany(companyId)),
            takeUntil(this.unsubscribe)
          ),
        ]).subscribe((companies) => {
          companies.forEach((company) => {
            this.companies.set(company.id, company);
          });
        });
      });
  }

  print(leg: LegsOfLineDto) {

    leg.upConsignments.forEach((consignment)=>{
      consignment['basicData'] = this.consignmentsById.get(consignment.consignmentId).consignmentBasicData;
      consignment['basicData'].lots.forEach((lot)=>{
        lot['translatedQuantityType'] = this.translationService.translate('consignment.lot.qtyTypes.' + lot.quantityType);
      });

      if (consignment['basicData'].loadingInLocation.premiseId === leg.premiseId) {
        consignment['locationInfo'] = consignment['basicData'].loadingInLocation;
      } else {
        consignment['locationInfo'] = this.consignmentsById.get(consignment.consignmentId).transshipmentLocations.find((location)=> location.premiseId === leg.premiseId);
      }
    });

    leg.downConsignments.forEach((consignment) => {
      consignment['basicData'] = this.consignmentsById.get(consignment.consignmentId).consignmentBasicData;
      consignment['basicData'].lots.forEach((lot)=>{
        lot['translatedQuantityType'] = this.translationService.translate('consignment.lot.qtyTypes.' + lot.quantityType);
      });

      if (consignment['basicData'].loadingOutLocation.premiseId === leg.premiseId) {
        consignment['locationInfo'] = consignment['basicData'].loadingInLocation;
      } else {
        consignment['locationInfo'] = this.consignmentsById.get(consignment.consignmentId).transshipmentLocations.find((location)=> location.premiseId === leg.premiseId);
      }
    });

    this.popoutService.openPopoutModal({
      modalName: PopoutModalName.CONSIGNMENTS,
      text: leg.address?.countryCode + ' ' + leg.address.city + ' ' + leg.address.streetName
        + ' ' + leg.address.streetType + ' ' + leg.address.streetNumber + ' - ' + leg.companyName,
      leg: leg,
    });

  }
}
