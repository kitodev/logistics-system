import { NotificationPersonalComponent } from './notifications/notification-personal/notification-personal.component';
import { NotificationOffersComponent } from './notifications/notification-offers/notification-offers.component';
import { NotificationConsignmentsComponent } from './notifications/notification-consignments/notification-consignments.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './shared/system/AppRoutes';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { StatsComponent } from './stats/stats.component';
import { CompanyListComponent } from './clients/company-list/company-list.component';
import { ClientsComponent } from './clients/clients.component';
import { CompanyDetailsComponent } from './clients/company/company-details/company-details.component';
import { CompanyComponent } from './clients/company/company.component';
import { PremiseComponent } from './clients/company/premise/premise.component';
import { EmployeeListComponent } from './clients/company/employee-list/employee-list.component';
import { ContactListComponent } from './clients/contact-list/contact-list.component';
import { ConsignmentComponent } from './consignment/consignment.component';
import { ParcelListComponent } from './consignment/parcel-list/parcel-list.component';
import { OfferRequestsListComponent } from './consignment/offers/offer-requests-list/offer-requests-list.component';
import { ParcelDetailsComponent } from './consignment/parcel-details/parcel-details.component';
import { OfferDetailsComponent } from './consignment/offers/offer-details/offer-details.component';
import { OfferConsignmentComponent } from './consignment/offers/offer-consignments/offer-consignment.component';
import { ParcelBasicDataComponent } from './consignment/parcel-details/parcel-basic-data/parcel-basic-data.component';
import { ParcelAddressDataComponent } from './consignment/parcel-details/parcel-address-data/parcel-address-data.component';
import { OfferAddresseeComponent } from './consignment/offers/offer-addressee/offer-addressee.component';
import {
  OffersType,
  OffersTypeParamName,
} from './consignment/offers/OffersType';
import { OfferBasicComponent } from './consignment/offers/offer-details/offer-basic/offer-basic.component';
import { MyCompanyComponent } from './clients/company/my-company/my-company.component';
import { OffersIncomingListComponent } from './consignment/offers/offers-incoming-list/offers-incoming-list.component';
/* import { ContractParcelsComponent } from './consignment/contract-parcels/contract-parcels/contract-parcels.component';*/
import { VehicleListComponent } from './clients/company/vehicle-list/vehicle-list.component';
import { VehicleComponent } from './clients/company/vehicle/vehicle.component';
import { LineManagementComponent } from './line-management/line-management.component';
import { LineListComponent } from './line-management/line-list/line-list.component';
import { LineOrganizationComponent } from './line-management/line-organization/line-organization.component';
/* eslint-disable-next-line max-len */
import { LineConsignmentOrganizerComponent } from './line-management/line-organization/line-consignment-organizer/line-consignment-organizer.component';
import { LineComponent } from './line-management/line/line.component';
import { EmployeeComponent } from './clients/company/employee/employee.component';
import { LineDetailsComponent } from './line-management/line/line-details/line-details.component';
import { StationsComponent } from './line-management/line/stations/stations.component';
import { LogonAppComponent } from './logon-app.component';
import { CompanyDocumentsComponent } from './clients/company/company-documents/company-documents.component';
import { ConsignmentFinancialMatrixListComponent } from './consignment/financial-matrix/financial-matrix-list.component';
import { PremiseListComponent } from './clients/company/premise-list/premise-list.component';
import { LineMapComponent } from './line-management/line/line-map/line-map.component';
import { ParcelDocumentsComponent } from './consignment/parcel-details/parcel-documents/parcel-documents.component';
import { LineDocumentsComponent } from './line-management/line/line-documents/line-documents.component';
import { ParcelMapComponent } from './consignment/parcel-details/parcel-map/parcel-map.component';
import { LineConsignmentsComponent } from './line-management/line/line-consignments/line-consignments.component';
import { LineFinancialMatrixListComponent } from './line-management/line/financial-matrix/financial-matrix-list.component';
import { StatusesComponent } from './statuses/statuses.component';
import { RoleGuard } from './auth/role.guard';
import { Role } from './auth/Role';
import { FaultyLinesComponent } from './statuses/faulty-lines/faulty-lines.component';
import { FaultyConsignmentsComponent } from './statuses/faulty-consignments/faulty-consignments.component';
import { ParcelModificationHistoryComponent } from './consignment/parcel-details/parcel-modification-history/parcel-modification-history.component';
import { OffersComponent } from './consignment/offers/offers.component';
import { SettingsComponent } from './settings/settings.component';
import { OrderListComponent } from './consignment/orders/order-list/order-list.component';
import { OrderComponent } from './consignment/orders/order/order.component';
import { OrderDetailsComponent } from './consignment/orders/order-details/order-details.component';
import { OrderBasicDataComponent } from './consignment/orders/order-basic-data/order-basic-data.component';
import { NotificationLinesComponent } from './notifications/notification-lines/notification-lines.component';
import { NotificationsComponent } from './notifications/notifications.component';

export interface RoleData {
  roles: Array<Role>;
  redirect: string;
}

const companyChildren: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'details',
  },
  {
    path: 'details',
    component: CompanyDetailsComponent,
  },
  {
    path: AppRoutes.PREMISES,
    component: PremiseListComponent,
  },
  {
    path: `${AppRoutes.PREMISES}/:id`,
    component: PremiseComponent,
  },
  {
    path: AppRoutes.EMPLOYEES,
    component: EmployeeListComponent,
  },
  {
    path: `${AppRoutes.EMPLOYEES}/:id`,
    component: EmployeeComponent,
  },
  {
    path: AppRoutes.VEHICLES,
    component: VehicleListComponent,
  },
  {
    path: `${AppRoutes.VEHICLES}/:id`,
    component: VehicleComponent,
  },
  {
    path: AppRoutes.DOCUMENTS,
    component: CompanyDocumentsComponent,
  },
];

const routes: Routes = [
  {
    path: '',
    component: LogonAppComponent,
    children: [
      { path: AppRoutes.LOGIN, component: LoginComponent },
      {
        path: 'stats',
        component: StatsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.SETTINGS,
        pathMatch: 'full',
        component: SettingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.COMPANY,
        component: ClientsComponent,
        children: [
          {
            path: AppRoutes.PARTNERS,
            component: CompanyListComponent,
          },
          {
            path: AppRoutes.CONTACTS,
            component: ContactListComponent,
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: AppRoutes.PARTNERS,
          },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.COMPANY + '/new',
        component: CompanyComponent,
        children: companyChildren,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          roles: [
            Role.AGENCY_ADMIN,
            Role.AGENCY_MANAGER,
            Role.AGENCY_FINANCIAL,
            Role.AGENCY_FREIGHT_ORGANISER,
          ],
          redirect: AppRoutes.COMPANY,
        } as RoleData,
      },
      {
        path: AppRoutes.COMPANY + '/:id',
        component: CompanyComponent,
        children: companyChildren,
        canActivate: [AuthGuard],
      },
      {
        path: `${AppRoutes.MY_COMPANY}/:id`,
        component: MyCompanyComponent,
        children: companyChildren,
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.CONSIGNMENT,
        component: ConsignmentComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: ParcelListComponent,
          },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: `${AppRoutes.CONSIGNMENT}/${AppRoutes.PARCEL}/:id`,
        component: ParcelDetailsComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'details',
          },
          {
            path: 'details',
            component: ParcelBasicDataComponent,
          },
          {
            path: 'address',
            component: ParcelAddressDataComponent,
          },
          {
            path: AppRoutes.MAP,
            component: ParcelMapComponent,
          },
          {
            path: 'financial-matrix',
            component: ConsignmentFinancialMatrixListComponent,
          },
          {
            path: AppRoutes.DOCUMENTS,
            component: ParcelDocumentsComponent,
          },
          {
            path: 'history',
            component: ParcelModificationHistoryComponent,
          },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.OFFER,
        component: OffersComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'offer-incoming',
          },
          {
            path: 'offer-incoming',
            component: OffersIncomingListComponent,
            data: { offersType: OffersType.Incoming },
          },
          {
            path: 'offer-incoming/:id',
            component: OffersIncomingListComponent,
            data: { offersType: OffersType.Incoming },
          },
          {
            path: 'offer-outgoing',
            component: OfferRequestsListComponent,
            data: { [OffersTypeParamName]: OffersType.Outgoing },
          },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.OFFER + '/offer-outgoing/:id',
        component: OfferDetailsComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'basic',
          },
          {
            path: 'basic',
            component: OfferBasicComponent,
          },
          {
            path: AppRoutes.CONSIGNMENT,
            component: OfferConsignmentComponent,
          },
          {
            path: 'addressee',
            component: OfferAddresseeComponent,
          },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.ORDER,
        component: OrderComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'order-list',
          },
          {
            path: 'order-list',
            component: OrderListComponent,
          },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: `${AppRoutes.ORDER}/:id`,
        component: OrderDetailsComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'details',
          },
          {
            path: 'details',
            component: OrderBasicDataComponent,
          },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.LINEMANAGEMENT,
        component: LineManagementComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: AppRoutes.LINELIST,
          },
          {
            path: AppRoutes.LINELIST,
            component: LineListComponent,
          },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: `${AppRoutes.LINEMANAGEMENT}/${AppRoutes.LINE}/:id`,
        component: LineComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'details',
          },
          {
            path: 'details',
            component: LineDetailsComponent,
          },
          {
            path: AppRoutes.STATIONS,
            component: StationsComponent,
          },
          {
            path: AppRoutes.MAP,
            component: LineMapComponent,
          },
          {
            path: AppRoutes.DOCUMENTS,
            component: LineDocumentsComponent,
          },
          {
            path: AppRoutes.CONSIGNMENTS,
            component: LineConsignmentsComponent,
          },
          {
            path: 'financial-matrix',
            component: LineFinancialMatrixListComponent,
          },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.LINEORGANIZATION,
        component: LineOrganizationComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'lines',
          },
          {
            path: 'lines',
            component: LineConsignmentOrganizerComponent,
          },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.STATUSES,
        component: StatusesComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'lines',
          },
          { path: 'lines', component: FaultyLinesComponent },
          { path: 'consignments', component: FaultyConsignmentsComponent },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.NOTIFICATION,
        component: NotificationsComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'offers',
          },
          { path: 'offers', component: NotificationOffersComponent },
          { path: 'lines', component: NotificationLinesComponent },
          { path: 'consignments', component: NotificationConsignmentsComponent },
        ],
        canActivate: [AuthGuard],
      },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogonAppRoutingModule {}
