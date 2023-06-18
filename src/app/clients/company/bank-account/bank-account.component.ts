import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../company.service';
import { FormModel } from 'src/app/shared/FormModel';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ModalService,
  ModalType,
} from '../../../shared/components/modal/modal.service';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { Router } from '@angular/router';
import { Currencies } from '../../../shared/finance/Currencies';
import { TranslocoService } from '@ngneat/transloco';
import { HotToastService } from '@ngneat/hot-toast';
import { Role } from '../../../auth/Role';
import { ResourceRule } from '../../../auth/employee-role.directive';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss'],
})
export class BankAccountComponent implements OnInit, OnDestroy {
  @Input() companyId: string;
  bankAccountForm: FormGroup;
  errors: HttpErrorResponse;
  bankAccounts: AccountNumberDto[] = [];
  account: AccountNumberDto;
  isEdit = false;

  private unsubscribe = new Subject<void>();

  faEdit = faEdit;
  faTrashAlt = faTrashAlt;

  Currencies = Object.values(Currencies);
  Role = Role;
  ResourceRule = ResourceRule;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private router: Router,
    private translationService: TranslocoService,
    private toastService: HotToastService
  ) {}

  ngOnInit(): void {
    this.loadBankAccounts();
    this.account = BankAccountComponent.createEmptyAccount();
    this.buildForm();
  }

  private loadBankAccounts(): void {
    this.companyService
      .getBankAccounts(this.companyId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.bankAccounts = response;
      });
  }

  private buildForm(): void {
    const bankAccountModel: FormModel<
      Omit<AccountNumberDto, 'id' | 'version'>
    > = {
      companyId: [this.companyId],
      bankName: [this.account.bankName, Validators.required],
      iban: [this.account.iban, Validators.required],
      accountNumber: [this.account.accountNumber, Validators.required],
      swiftCode: [this.account.swiftCode, Validators.required],
      currencyIdentifier: [
        this.account.currencyIdentifier,
        Validators.required,
      ],
    };

    this.bankAccountForm = this.fb.group(bankAccountModel);
  }

  private static createEmptyAccount(): AccountNumberDto {
    return {
      companyId: '',
      bankName: '',
      iban: '',
      swiftCode: '',
      accountNumber: '',
      currencyIdentifier: null,
    };
  }

  createAccount(): void {
    if (this.bankAccountForm.valid) {
      const newAccount: Omit<AccountNumberDto, 'id' | 'version'> = {
        ...this.bankAccountForm.value,
      };

      this.companyService
        .createBankAccount(this.companyId, newAccount)
        .pipe(
          this.toastService.observe({
            loading: this.translationService.translate('messages.saving'),
            success: this.translationService.translate('messages.changesSaved'),
            error: this.translationService.translate('messages.saveError'),
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe(
          () => {
            this.loadBankAccounts();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    } else {
      this.bankAccountForm.markAllAsTouched();
    }
  }

  editAccount(account: AccountNumberDto): void {
    this.isEdit = true;
    this.account = account;
    this.buildForm();
  }

  updateAccount(): void {
    if (this.bankAccountForm.valid) {
      const updatedAccount: AccountNumberDto = {
        ...this.bankAccountForm.value,
      };
      updatedAccount.id = this.account.id;

      this.companyService
        .updateBankAccount(this.companyId, updatedAccount)
        .pipe(
          this.toastService.observe({
            loading: this.translationService.translate('messages.saving'),
            success: this.translationService.translate('messages.changesSaved'),
            error: this.translationService.translate('messages.saveError'),
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe(
          () => {
            this.loadBankAccounts();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    } else {
      this.bankAccountForm.markAllAsTouched();
    }
  }

  reset(): void {
    this.account = BankAccountComponent.createEmptyAccount();
    this.bankAccountForm.reset({
      companyId: this.companyId,
    });
    this.isEdit = false;
    this.errors = null;
    this.buildForm();
  }

  delAccount(accountId: string): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'bankAccount')
      .pipe(filter((response) => response))
      .subscribe(() => {
        this.companyService
          .deleteBankAccount(this.companyId, accountId)
          .pipe(
            this.toastService.observe({
              loading: this.translationService.translate('messages.saving'),
              success: this.translationService.translate('messages.success', {
                item: this.translationService.translate('messages.delete'),
              }),
              error: this.translationService.translate('messages.saveError'),
            }),
            takeUntil(this.unsubscribe)
          )
          .subscribe(
            () => {
              this.loadBankAccounts();
            },
            (error: HttpErrorResponse) => {
              this.errors = error;
            }
          );
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
