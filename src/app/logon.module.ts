import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationPersonalComponent } from './notifications/notification-personal/notification-personal.component';
import { NotificationOffersComponent } from './notifications/notification-offers/notification-offers.component';
import { NotificationLinesComponent } from './notifications/notification-lines/notification-lines.component';
import { NotificationConsignmentsComponent } from './notifications/notification-consignments/notification-consignments.component';
import { NgModule } from '@angular/core';
import { LogonAppComponent } from './logon-app.component';
import { AlertComponent } from './shared/components/alert/alert.component';
import { CompanyDocumentsComponent } from './clients/company/company-documents/company-documents.component';
import { LoginComponent } from './login/login.component';
import { ClientsComponent } from './clients/clients.component';
import { StatsComponent } from './stats/stats.component';
import { CompanyComponent } from './clients/company/company.component';
import { CompanyBasicDataComponent } from './clients/company/company-basic-data/company-basic-data.component';
import { BankAccountComponent } from './clients/company/bank-account/bank-account.component';
import { CompanyListComponent } from './clients/company-list/company-list.component';
import { CompanyDetailsComponent } from './clients/company/company-details/company-details.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { PremiseComponent } from './clients/company/premise/premise.component';
import { ConsignmentComponent } from './consignment/consignment.component';
import { OffersComponent } from './consignment/offers/offers.component';
import { ParcelListComponent } from './consignment/parcel-list/parcel-list.component';
import { OfferRequestsListComponent } from './consignment/offers/offer-requests-list/offer-requests-list.component';
import { ParcelDetailsComponent } from './consignment/parcel-details/parcel-details.component';
import { DateRangeFilterComponent } from './shared/table/filters/date-range-filter.component';
import { SelectOneFilterComponent } from './shared/table/filters/select-one-filter.component';
import { OfferDetailsComponent } from './consignment/offers/offer-details/offer-details.component';
import { OfferConsignmentComponent } from './consignment/offers/offer-consignments/offer-consignment.component';
import { LotsComponent } from './consignment/lots/lots.component';
import { EmployeeListComponent } from './clients/company/employee-list/employee-list.component';
import { OfferAddresseeComponent } from './consignment/offers/offer-addressee/offer-addressee.component';
import { OfferBasicComponent } from './consignment/offers/offer-details/offer-basic/offer-basic.component';
import { OfferNotSendablePipe } from './consignment/offers/offer-details/utils/offer-not-sendable.pipe';
import { OfferLifecycleComponent } from './consignment/offers/offer-details/offer-lifecycle/offer-lifecycle.component';
import { OfferDeadlineComponent } from './consignment/offers/offer-details/offer-deadline/offer-deadline.component';
import { OfferNotConvertiblePipe } from './consignment/offers/offer-details/utils/offer-not-convertible.pipe';
import { ParcelAddressDataComponent } from './consignment/parcel-details/parcel-address-data/parcel-address-data.component';
import { ParcelBasicDataComponent } from './consignment/parcel-details/parcel-basic-data/parcel-basic-data.component';
import { ContactListComponent } from './clients/contact-list/contact-list.component';
import { OfferResultsComponent } from './consignment/offers/offer-details/offer-results/offer-results.component';
import { MyCompanyComponent } from './clients/company/my-company/my-company.component';
import { EmployeeIdentificationNumberPipe } from './shared/pipes/employee/employee-identification-number.pipe';
import { EmployeeIdentificationExpirationPipe } from './shared/pipes/employee/employee-identification-expiration.pipe';
import { OffersIncomingListComponent } from './consignment/offers/offers-incoming-list/offers-incoming-list.component';
import { ContractParcelsComponent } from './consignment/contract-parcels/contract-parcels/contract-parcels.component';
import { OfferRoutePipe } from './shared/pipes/offer/offer-route.pipe';
import { OfferLotPipe } from './shared/pipes/offer/offer-lot.pipe';
import { LotEditComponent } from './consignment/lots/lot-edit/lot-edit.component';
import { ConsignmentBasicDataComponent } from './consignment/shared/consignment-basic-data/consignment-basic-data.component';
import { OfferByEmployeePipe } from './consignment/offers/offer-details/utils/offer-by-employee.pipe';
import { IsReceiverPipe } from './consignment/offers/offer-addressee/is-receiver.pipe';
import { VehicleListComponent } from './clients/company/vehicle-list/vehicle-list.component';
import { VehicleComponent } from './clients/company/vehicle/vehicle.component';
import { BidderPipe } from './consignment/offers/offer-details/offer-results/bidder.pipe';
import { LocationSelectorComponent } from './shared/components/location-selector/location-selector.component';
import { TimeGateComponent } from './consignment/shared/timegate/time-gate.component';
import { DefaultOrderKeyValuePipe } from './shared/pipes/default-order-key-value.pipe';
import { LocationInfoComponent } from './consignment/parcel-details/parcel-basic-data/location-info/location-info.component';
import { AddressPipe } from './shared/pipes/address.pipe';
import { ContactInfoComponent } from './shared/components/contact-info/contact-info.component';
import { EmployeeNamePipe } from './shared/pipes/employee/employee-name.pipe';
import { TimeGateInfoComponent } from './consignment/parcel-details/parcel-basic-data/time-gate-info/time-gate-info.component';
import { CommentsComponent } from './shared/components/comments/comments.component';
import { CommentListComponent } from './shared/components/comment-list/comment-list.component';
import { LocationsListComponent } from './consignment/parcel-details/parcel-address-data/locations-list/locations-list.component';
import { LineManagementComponent } from './line-management/line-management.component';
import { EmployeeComponent } from './clients/company/employee/employee.component';
import { ConsignmentInfoComponent } from './shared/components/consignment-info/consignment-info.component';
import { LineListComponent } from './line-management/line-list/line-list.component';
import { LineComponent } from './line-management/line/line.component';
import { LineDetailsComponent } from './line-management/line/line-details/line-details.component';
import { LineOrganizationComponent } from './line-management/line-organization/line-organization.component';
/* eslint-disable-next-line max-len */
import { LineConsignmentOrganizerComponent } from './line-management/line-organization/line-consignment-organizer/line-consignment-organizer.component';
import { StationsComponent } from './line-management/line/stations/stations.component';
import { OfferLotWeightSumPipe } from './shared/pipes/offer-lot-weight-sum.pipe';
import { AuthGuard } from './auth/auth.guard';
import {
  OWL_DATE_TIME_FORMATS,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
import { LogonAppRoutingModule } from './logon-app-routing.module';
import { ClarityModule } from '@clr/angular';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoRootModule } from './transloco-root.module';
import { ConsignmentLocationStatusComponent } from './shared/components/consignment-location-status/consignment-location-status.component';
import { FileUploaderComponent } from './shared/components/file-uploader/file-uploader.component';
import { OfferListRoutePipe } from './consignment/offers/offer-requests-list/offer-list-route.pipe';
import { LotBooleanPropertyPipe } from './consignment/parcel-list/lot-boolean-property.pipe';
import { LegsOnLinePipe } from './consignment/parcel-list/legs-on-line.pipe';
import { OfferBidCountPipe } from './consignment/offers/offer-requests-list/offer-bid-count.pipe';
import { OfferConsignmentInfoComponent } from './consignment/offers/offer-requests-list/offer-consignment-info/offer-consignment-info.component';
import { AdrSignComponent } from './shared/components/adr-sign/adr-sign.component';
import { GivenConsignmentInfoComponent } from './consignment/offers/given-consignment-info/given-consignment-info.component';
import { ConsignmentFinancialMatrixListComponent } from './consignment/financial-matrix/financial-matrix-list.component';
import { LineFinancialMatrixListComponent } from './line-management/line/financial-matrix/financial-matrix-list.component';
import { PremiseListComponent } from './clients/company/premise-list/premise-list.component';
import { SelectSeatPipe } from './shared/pipes/company/select-seat.pipe';
import { MapComponent } from './map/map/map.component';
import { LineMapComponent } from './line-management/line/line-map/line-map.component';
import { UserSettingsListComponent } from './shared/components/user-settings-list/user-settings-list.component';
import { QRCodeModule } from 'angularx-qrcode';
import { QrLotComponent } from './consignment/lots/qr-lot/qr-lot.component';
import { ParcelDocumentsComponent } from './consignment/parcel-details/parcel-documents/parcel-documents.component';
import { LineDocumentsComponent } from './line-management/line/line-documents/line-documents.component';
import { EmployeeRoleDirective } from './auth/employee-role.directive';
import { DocumentsComponent } from './shared/documents/documents.component';
import { NgxFilesizeModule } from 'ngx-filesize';
import { RejectEnablePipe } from './consignment/offers/offers-incoming-list/reject-enable.pipe';
import { FormComponentModule } from './shared/form/form-component.module';
import { EmployeeSelectorComponent } from './shared/form/employee-selector/employee-selector.component';
import { ParcelMapComponent } from './consignment/parcel-details/parcel-map/parcel-map.component';
import { LineConsignmentsComponent } from './line-management/line/line-consignments/line-consignments.component';
import { LineLotsInfoComponent } from './line-management/line/line-consignments/line-lots-info/line-lots-info.component';
import { LegOfLocationPipe } from './consignment/parcel-details/parcel-map/leg-of-location.pipe';
import { StationConsignmentsComponent } from './line-management/line/line-consignments/station-consignments/station-consignments.component';
import { SummaryComponent } from './shared/finance/summary/summary.component';
import { FinancialMatrixComponent } from './shared/finance/form/financial-matrix.component';
import { StatusesComponent } from './statuses/statuses.component';
import { LargeNumberPipe } from './shared/pipes/large-number.pipe';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { FaultyConsignmentsComponent } from './statuses/faulty-consignments/faulty-consignments.component';
import { FaultyLinesComponent } from './statuses/faulty-lines/faulty-lines.component';
import { StationStatusDisplayComponent } from './statuses/faulty-lines/station-status-display/station-status-display.component';
import { HistoryComponent } from './shared/components/history/history.component';
import { ParcelModificationHistoryComponent } from './consignment/parcel-details/parcel-modification-history/parcel-modification-history.component';
import { LineConsignmentsInfoComponent } from './line-management/line-list/line-consignments-info/line-consignments-info.component';
import { LineListDetailComponent } from './line-management/line-list/line-list-detail/line-list-detail.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SettingsComponent } from './settings/settings.component';
import { OrderComponent } from './consignment/orders/order/order.component';
import { OrderListComponent } from './consignment/orders/order-list/order-list.component';
import { OrderDetailsComponent } from './consignment/orders/order-details/order-details.component';
import { OrderBasicDataComponent } from './consignment/orders/order-basic-data/order-basic-data.component';
import { TextEditorComponent } from './shared/components/text-editor/text-editor.component';
import { QuillModule } from 'ngx-quill';
import { ConsignmentBulkEditorComponent } from './shared/components/modal/consignment-bulk-editor/consignment-bulk-editor.component';
import { OrderBulkEditorComponent } from './shared/components/modal/order-bulk-editor/order-bulk-editor.component';
import { ModalService } from './shared/components/modal/modal.service';

export const MY_MOMENT_FORMATS = {
  parseInput: 'YYYY-MM-DD HH:mm',
  fullPickerInput: 'YYYY. MM. DD. HH:mm',
  datePickerInput: 'YYYY. MM. DD.',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  declarations: [
    LogonAppComponent,
    AlertComponent,
    CompanyDocumentsComponent,
    LoginComponent,
    ClientsComponent,
    StatsComponent,
    TextEditorComponent,
    CompanyComponent,
    CompanyBasicDataComponent,
    BankAccountComponent,
    CompanyListComponent,
    CompanyDetailsComponent,
    ModalComponent,
    PremiseComponent,
    ConsignmentComponent,
    OffersComponent,
    ParcelListComponent,
    OfferRequestsListComponent,
    ParcelDetailsComponent,
    DateRangeFilterComponent,
    SelectOneFilterComponent,
    OfferDetailsComponent,
    OfferConsignmentComponent,
    LotsComponent,
    EmployeeListComponent,
    OfferAddresseeComponent,
    OfferBasicComponent,
    OfferNotSendablePipe,
    OfferLifecycleComponent,
    OfferDeadlineComponent,
    OfferNotConvertiblePipe,
    ParcelAddressDataComponent,
    ParcelAddressDataComponent,
    ParcelBasicDataComponent,
    ContactListComponent,
    LoginComponent,
    OfferResultsComponent,
    EmployeeSelectorComponent,
    MyCompanyComponent,
    EmployeeIdentificationNumberPipe,
    EmployeeIdentificationExpirationPipe,
    OffersIncomingListComponent,
    ContractParcelsComponent,
    OfferRoutePipe,
    OfferLotPipe,
    LotEditComponent,
    ConsignmentBasicDataComponent,
    OfferByEmployeePipe,
    IsReceiverPipe,
    VehicleListComponent,
    VehicleComponent,
    BidderPipe,
    LocationSelectorComponent,
    TimeGateComponent,
    DefaultOrderKeyValuePipe,
    LocationInfoComponent,
    AddressPipe,
    ContactInfoComponent,
    EmployeeNamePipe,
    TimeGateInfoComponent,
    CommentsComponent,
    CommentListComponent,
    LocationsListComponent,
    LineManagementComponent,
    EmployeeComponent,
    ConsignmentInfoComponent,
    LineListComponent,
    LineComponent,
    LineDetailsComponent,
    LineOrganizationComponent,
    LineConsignmentOrganizerComponent,
    StationsComponent,
    OfferLotWeightSumPipe,
    ConsignmentLocationStatusComponent,
    FileUploaderComponent,
    OfferListRoutePipe,
    LotBooleanPropertyPipe,
    LegsOnLinePipe,
    OfferBidCountPipe,
    OfferConsignmentInfoComponent,
    AdrSignComponent,
    CompanyDocumentsComponent,
    ConsignmentFinancialMatrixListComponent,
    LineFinancialMatrixListComponent,
    GivenConsignmentInfoComponent,
    PremiseListComponent,
    SelectSeatPipe,
    MapComponent,
    LineMapComponent,
    UserSettingsListComponent,
    QrLotComponent,
    ParcelDocumentsComponent,
    LineDocumentsComponent,
    EmployeeRoleDirective,
    DocumentsComponent,
    RejectEnablePipe,
    ParcelMapComponent,
    LineConsignmentsComponent,
    LineLotsInfoComponent,
    LegOfLocationPipe,
    StationConsignmentsComponent,
    FinancialMatrixComponent,
    SummaryComponent,
    StatusesComponent,
    LargeNumberPipe,
    NotFoundComponent,
    FaultyConsignmentsComponent,
    FaultyLinesComponent,
    StationStatusDisplayComponent,
    HistoryComponent,
    ParcelModificationHistoryComponent,
    LineConsignmentsInfoComponent,
    LineListDetailComponent,
    SettingsComponent,
    ConsignmentBulkEditorComponent,
    OrderBulkEditorComponent,
    OrderComponent,
    OrderListComponent,
    OrderDetailsComponent,
    OrderBasicDataComponent,
    NotificationsComponent,
    NotificationLinesComponent,
    NotificationOffersComponent,
    NotificationPersonalComponent,
    NotificationConsignmentsComponent
  ],
  imports: [
    CommonModule,
    QuillModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    LogonAppRoutingModule,
    ClarityModule,
    NgxFileDropModule,
    NgxChartsModule,
    FontAwesomeModule,
    NgSelectModule,
    NgOptionHighlightModule,
    DragDropModule,
    FormsModule,
    TranslocoRootModule,
    ReactiveFormsModule,
    QRCodeModule,
    NgxFilesizeModule,
    FormComponentModule,
  ],
  providers: [
    AuthGuard,
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    ModalService,
  ],
  bootstrap: [LogonAppComponent],
})
export class LogonModule {}
