import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormSelectItem } from '../../../shared/form/select/FormSelectItem';
import { ConsignmentFormsService } from '../../consignment-forms.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormModel } from '../../../shared/FormModel';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-lot-edit',
  templateUrl: './lot-edit.component.html',
  styleUrls: ['./lot-edit.component.scss'],
})
export class LotEditComponent implements OnInit, OnDestroy {
  get lot(): LotDto {
    return this._lot;
  }

  @Input()
  set lot(value: LotDto) {
    this._lot = value;
    this.buildForm();
  }

  lotForm: FormGroup;
  quantityTypes: Array<FormSelectItem<QuantityType>>;
  lotGroups: Array<FormSelectItem<LotGroup>>;
  classifications: Array<FormSelectItem<Classification>>;

  private _lot: LotDto;
  @Input()
  isEdit = false;
  @Input()
  discardEnabled = false;
  @Output()
  onAddLot: EventEmitter<LotDto> = new EventEmitter<LotDto>();
  @Output()
  isDirty: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  onDiscard: EventEmitter<void> = new EventEmitter<void>();

  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private consignmentFormsService: ConsignmentFormsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.quantityTypes = this.consignmentFormsService.getLotQuantityTypes();
    this.lotGroups = this.consignmentFormsService.getLotGroups();
    this.classifications = this.consignmentFormsService.getLotClassifications();

    this.buildForm();
  }

  addLot(): void {
    this.onAddLot.emit(this.lotForm.value);
    this.lotForm.reset(ConsignmentFormsService.createEmptyLot());
  }

  private buildForm(): void {
    const lotModel: FormModel<Omit<LotDto, 'id'>> = {
      quantity: [this.lot.quantity, Validators.required],
      quantityType: [this.lot.quantityType, Validators.required],
      weight: [this.lot.weight, Validators.required],
      lmeter: [this.lot.lmeter],
      cbm: [this.lot.cbm],
      length: [this.lot.length],
      width: [this.lot.width],
      height: [this.lot.height],
      stackable: [this.lot.stackable],
      lotIdentifier: [this.lot.lotIdentifier],
      customs: [this.lot.customs],
      adr: [this.lot.adr],
      adrIdentifier: [this.lot.adrIdentifier],
      unNumber: [this.lot.unNumber],
      lotGroup: [this.lot.lotGroup],
      classification: [this.lot.classification], //TODO format: Classification
      name: [this.lot.name, Validators.required],
    };

    this.lotForm = this.fb.group(lotModel);

    this.lotForm.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((formValue) => {
        this.lotForm.dirty;
        if (
          !(
            formValue.cbm ||
            formValue.lmeter ||
            (formValue.length && formValue.width && formValue.height)
          )
        ) {
          this.lotForm.setErrors({ lotTriplet: true });
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  discard() {
    this.onDiscard.emit();
  }
}
