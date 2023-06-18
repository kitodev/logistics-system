import { Component, OnDestroy, ViewContainerRef } from '@angular/core';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons/faAddressBook';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { ModalService } from '../shared/components/modal/modal.service';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CompanyService } from './company.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { ModalInputType } from '../shared/components/modal/modal.component';
import { Role } from '../auth/Role';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnDestroy {
  faPlus = faPlus;
  faUsers = faUsers;
  faAddressBook = faAddressBook;
  Role = Role;
  private unsubscribe = new Subject<void>();

  constructor(
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private companyService: CompanyService,
    private toastService: HotToastService,
    private translationService: TranslocoService
  ) {}

  openInvitationModal() {
    this.modalService
      .openInputModal(
        this.vcr,
        'company.invitation.label',
        'company.email',
        ModalInputType.INPUT,
        'general.send'
      )
      .pipe(
        filter((response) => !!response.length),
        mergeMap((response) => this.companyService.invitePartner(response)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => {
          this.toastService.success(
            this.translationService.translate('messages.successfulOperation')
          );
        },
        () => {
          this.toastService.error(
            this.translationService.translate('messages.operationFailed')
          );
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
