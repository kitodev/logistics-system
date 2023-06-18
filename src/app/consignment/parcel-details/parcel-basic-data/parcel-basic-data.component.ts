import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { FormModel } from 'src/app/shared/FormModel';
import { HttpErrorResponse } from '@angular/common/http';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { Observable, Subject } from 'rxjs';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { catchError, take, takeUntil, tap } from 'rxjs/operators';
import { CompanyService } from 'src/app/clients/company.service';
import { ConsignmentFormsService } from '../../consignment-forms.service';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons/faUserAlt';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt';
import {
  CommentApis,
  CommentService,
} from '../../../shared/components/comments/comment.service';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons/faStickyNote';
import { employeeSearch } from '../../../shared/employeeSearch';
import { LoadDraftFormService } from 'src/app/shared/system/load-draft-form.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { PopoutModalName } from '../../../shared/popout/PopoutModalData';
import { PopoutService } from '../../../shared/popout/popout.service';
import { TomTomAddress, TomTomService } from '../../../map/tom-tom.service';
import { ConsignmentMockService } from '../../consignment-mock.service';

@Component({
  selector: 'app-parcel-basic-data',
  templateUrl: './parcel-basic-data.component.html',
  styleUrls: ['./parcel-basic-data.component.scss'],
})
export class ParcelBasicDataComponent implements OnInit, OnDestroy {
  consignmentDataForm: FormGroup;
  consignment: ConsignmentDto = null;
  consignmentId: string;
  errors: HttpErrorResponse;
  isLoading = true;
  isNew = true;
  // tradeTypes: FormSelectItem<TradeType>[];
  // transportModes: FormSelectItem<TransportMode>[];
  // parityList: FormSelectItem<Parity>[];

  private unsubscribe = new Subject<void>();
  refreshComments = new Subject<void>();
  private routeSub: any;

  partners: CompanyDto[];
  contacts: EmployeeDto[] = [];
  faUser = faUserAlt;
  selectedPartnerCompany: CompanyDto;
  selectedContact: EmployeeDto;

  CommentApis = CommentApis;
  employeeSearchFn = employeeSearch;
  faMapMarker = faMapMarkerAlt;
  faStickyNote = faStickyNote;
  selectedConsignee: CompanyDto;
  selectedSender: CompanyDto;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private consignmentService: ConsignmentBEService,
    private consignmentsFormService: ConsignmentFormsService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private vcr: ViewContainerRef,
    private draftFormService: LoadDraftFormService,
    private toastService: HotToastService,
    private translationService: TranslocoService,
    private tomtomService: TomTomService,
    private popoutService: PopoutService,
    private commentService: CommentService
  ) {
    this.route.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.consignmentId =
          params.get('id') == 'new' ? null : params.get('id');
        this.isNew = !this.consignmentId;
      });
  }

  ngOnInit(): void {
    // this.tradeTypes = this.consignmentsFormService.getConsignmentTradeTypes();
    // this.transportModes = this.consignmentsFormService.getTransportModes();
    // this.parityList = this.consignmentsFormService.getConsignmentParityList();

    if (this.isNew) {
      this.loadPartners()
        .pipe(take(1))
        .subscribe(() => {
          this.consignment = ConsignmentFormsService.createEmptyConsignment();
          this.buildForm();

          this.draftFormService.loadDraftModal(
            SettingsSections.PARCEL,
            this.consignmentDataForm,
            this.vcr
          );

          //TODO lots?

          this.routeSub = this.router.events.subscribe((event) => {
            if (
              event instanceof NavigationStart &&
              !this.consignmentDataForm.pristine
            ) {
              this.draftFormService.saveFormData(
                SettingsSections.PARCEL,
                this.consignmentDataForm.value
              );
            }
          });
        });
    } else {
      this.consignmentService
        .findConsignemntById(this.consignmentId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((consignment) => {
          this.onConsignmentDataLoad(consignment);
        });
    }
  }

  private onConsignmentDataLoad(consignment: ConsignmentDto): void {
    this.consignment = consignment;

    if (consignment.consignorEmployeeId) {
      this.companyService
        .getEmployeeById(consignment.consignorEmployeeId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((employee) => {
          this.selectedContact = employee;
          this.loadPartners().subscribe(() => {
            this.selectedPartnerCompany = this.partners.find(
              (partner) => partner.id === employee.companyId
            );
            this.partnerInputChanged();
          });
        });
    } else {
      this.loadPartners().subscribe();
    }
    this.buildForm();
    this.isLoading = false;
  }

  private buildForm(): void {
    const consignmentFormModel: FormModel<
      Omit<
        ConsignmentDto,
        'consignmentId' | 'version' | 'id' | 'consignmentBasicData'
      >
    > = {
      consignorEmployeeId: [this.consignment.consignorEmployeeId, Validators.required],
    };
    this.consignmentDataForm = this.fb.group(consignmentFormModel);
  }

  private loadPartners(): Observable<unknown> {
    return this.companyService.getProcessedPartners().pipe(
      takeUntil(this.unsubscribe),
      tap((response) => {
        this.partners = response;
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  partnerInputChanged(): void {
    if (this.selectedPartnerCompany) {
      this.companyService
        .getEmployees(this.selectedPartnerCompany.id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.contacts = response;
            if (
              this.selectedPartnerCompany.id !== this.selectedContact?.companyId
            ) {
              this.selectedContact = undefined;
              this.consignmentDataForm
                ?.get('consignorEmployeeId')
                .setValue(null);
            }
            this.isLoading = false;
            return response;
          },
          (error: HttpErrorResponse) => {
            return error;
          }
        );
    }
  }

  createConsignment(): void {
    if (this.consignmentDataForm.invalid) {
      this.toastService.error(
        this.translationService.translate('messages.checkForm')
      );
      this.consignmentDataForm.markAllAsTouched();
      return;
    }
    const newConsignment: Omit<ConsignmentDto, 'id' | 'version'> = {
      ...this.consignmentDataForm.value,
    };
    const locations: Array<TomTomAddress> = [
      TomTomService.toTomTomAddress(
        newConsignment.consignmentBasicData.loadingInLocation.premiseAddress
      ),
      TomTomService.toTomTomAddress(
        newConsignment.consignmentBasicData.loadingOutLocation.premiseAddress
      ),
    ];
    this.tomtomService.geocodeBatch(locations).subscribe((results) => {
      ConsignmentMockService.updateLocationCoordinates(
        newConsignment,
        results.batchItems
      );
      this.consignmentService
        .createConsignment(newConsignment)
        .pipe(
          this.toastService.observe({
            loading: this.translationService.translate('messages.saving'),
            success: this.translationService.translate('messages.changesSaved'),
            error: this.translationService.translate('messages.saveError'),
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe(
          (responseConsignment) => {
            this.consignment = responseConsignment;
            this.consignmentDataForm.reset();
            this.router
              .navigateByUrl(`${AppRoutes.CONSIGNMENT}/${AppRoutes.PARCEL}`)
              .then();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    });
  }

  updateConsignment(): void {
    if (this.consignmentDataForm.invalid) {
      this.toastService.error(
        this.translationService.translate('messages.checkForm')
      );
      this.consignmentDataForm.markAllAsTouched();
      return;
    }
    const updatedConsignment: ConsignmentDto = {
      ...this.consignment,
      ...this.consignmentDataForm.value,
    };
    const locations: Array<TomTomAddress> = [
      TomTomService.toTomTomAddress(
        updatedConsignment.consignmentBasicData.loadingInLocation.premiseAddress
      ),
      ...updatedConsignment.transshipmentLocations.map((location) =>
        TomTomService.toTomTomAddress(location.premiseAddress)
      ),
      TomTomService.toTomTomAddress(
        updatedConsignment.consignmentBasicData.loadingOutLocation
          .premiseAddress
      ),
    ];
    updatedConsignment.consignmentId = this.consignment.consignmentId;
    updatedConsignment.version = this.consignment.version;

    this.tomtomService
      .geocodeBatch(locations)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((results) => {
        ConsignmentMockService.updateLocationCoordinates(
          updatedConsignment,
          results.batchItems
        );
        ConsignmentFormsService.toProperConsignmentDto(updatedConsignment);
        this.consignmentService
          .updateConsignment(updatedConsignment.id, updatedConsignment)
          .pipe(
            this.toastService.observe({
              loading: this.translationService.translate('messages.saving'),
              success: this.translationService.translate(
                'messages.changesSaved'
              ),
              error: this.translationService.translate('messages.saveError'),
            }),
            takeUntil(this.unsubscribe)
          )
          .subscribe(
            (responseConsignment) => {
              this.consignment = responseConsignment;
              this.consignmentDataForm.markAsPristine();
            },
            (error: HttpErrorResponse) => {
              this.errors = error;
            }
          );
      });
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onContactSelect(contact: EmployeeDto): void {
    this.selectedContact = contact;
  }

  print(lot: LotDto): void {
    const sender = this.partners.find(
      (partner) =>
        partner.id ===
        this.consignment.consignmentBasicData.loadingInLocation.sender
    )?.companyName;
    const addressee = this.partners.find(
      (partner) =>
        partner.id ===
        this.consignment.consignmentBasicData.loadingOutLocation.sender
    )?.companyName;

    this.popoutService.openPopoutModal({
      modalName: PopoutModalName.LOT_QR,
      text: lot.name,
      sender,
      addressee,
      lot,
    });
  }

  sendVerification(): void {
    const verificationComment = this.translationService.translate(
      'consignment.verifiedData'
    );

    this.commentService
      .createComment(
        CommentApis.CONSIGNMENT_ENDPOINT,
        this.consignmentId,
        verificationComment
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.refreshComments.next();
      });
  }
}
