import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { FormModel } from 'src/app/shared/FormModel';
import { TranslocoService } from '@ngneat/transloco';
import { FinanceCurrencies } from 'src/app/shared/finance/FinanceCurrencies';
import { FinanceService } from 'src/app/shared/finance/finance.service';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { CompanyService } from 'src/app/clients/company.service';

export enum FinanceType {
  LINE ='line',
  CONSIGNMENT = 'consignment'
}

@Component({
  selector: 'app-financial-matrix-form',
  templateUrl: './financial-matrix.component.html',
  styleUrls: ['./financial-matrix.component.scss'],
})
export class FinancialMatrixComponent implements OnInit, OnDestroy {
  @Input()
  isNew: boolean;

  @Input()
  entry?: FinancialReadEntryDto;

  @Input()
  id: string;

  @Input()
  type: FinanceType;

  @Input()
  version: number;

  @Output() financeSave = new EventEmitter<string>();

  financeForm: FormGroup;
  private unsubscribe = new Subject<void>();

  Currencies = Object.values(FinanceCurrencies);
  
  financialSigns: FormSelectItem<FinancialSign>[] = [];
  amountUnits: FormSelectItem<FinancialAmountUnit>[] = [];
  typeOfServiceOrGoods: FormSelectItem<TypeOfServiceOrGoods>[] = [];

  partners: CompanyDto[];

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private translationService: TranslocoService,
    private financeService: FinanceService
  ) {
  }

  ngOnInit(): void {
    this.financialSigns = Object.keys(FinancialSign).map((key) => ({
      value: FinancialSign[key],
      label: this.translationService.translate(
        'finance.financialSigns.' + FinancialSign[key]
      ),
    }));

    this.amountUnits = Object.keys(FinancialAmountUnit).map((key) => ({
      value: FinancialAmountUnit[key],
      label: this.translationService.translate(
        'finance.amountUnits.' + FinancialAmountUnit[key]
      ),
    }));

    this.typeOfServiceOrGoods = Object.keys(TypeOfServiceOrGoods).map((key) => ({
      value: TypeOfServiceOrGoods[key],
      label: this.translationService.translate(
        'finance.typeOfServiceOrGoods.' + TypeOfServiceOrGoods[key]
      ),
    }));

    this.loadPartners().subscribe();

    if (this.isNew) {
      this.entry = this.createEmptyEntry();
    }

    this.buildForm();
  }

  private buildForm(): void {
    const unitPrice: FormModel<MoneyDto> = {
      amount: [this.entry?.unitPrice.amount, Validators.required],
      currency: [this.entry?.unitPrice.currency, Validators.required],
    };

    const financeFormModel: FormModel<FinancialWriteEntryDto> = {
      rootVersion: [this.version, Validators.required],
      typeOfServicesOrGoods: [
        this.entry?.typeOfServicesOrGoods,
        Validators.required,
      ],
      description: [this.entry?.description, Validators.required],
      dateOfFulfillment: [this.entry?.dateOfFulfillment, Validators.required],
      amount: [this.entry?.amount, Validators.required],
      amountUnit: [this.entry?.amountUnit, Validators.required],
      vat: [this.entry?.vat, Validators.required],
      notes: [this.entry?.notes],
      financialSign: [this.entry?.financialSign, Validators.required],
      unitPrice: this.fb.group(unitPrice),
      partnerId: [this.entry?.partnerId, Validators.required],
    };
    this.financeForm = this.fb.group(financeFormModel);
  }

  private createEmptyEntry(): FinancialWriteEntryDto {
    return {
      rootVersion: this.version,
      typeOfServicesOrGoods: null,
      description: '',
      dateOfFulfillment: '',
      amount: null,
      amountUnit: null,
      vat: null,
      notes: '',
      financialSign: null,
      unitPrice: {
        currency: null,
        amount: null,
      },
      partnerId: '',
    };
  }

  createFinance() {
    const newFinance: FinancialWriteEntryDto = {
      ...this.financeForm.value,
    };

    this.financeService
      .createEntry(this.type, this.id, newFinance)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.financeForm.reset();
        this.financeSave.emit();
      });
  }

  updateFinance() {
    const updatedFinance: FinancialWriteEntryDto = {
      ...this.financeForm.value,
    };

    this.financeService
      .updateEntry(this.type, this.id, updatedFinance, this.entry.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.financeSave.emit();
      });
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
