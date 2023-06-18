import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { FormSelectItem } from '../../shared/form/select/FormSelectItem';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faCubes } from '@fortawesome/free-solid-svg-icons/faCubes';
import { ConsignmentFormsService } from '../consignment-forms.service';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { HttpErrorResponse } from '@angular/common/http';
import { faQrcode } from '@fortawesome/free-solid-svg-icons/faQrcode';

@Component({
  selector: 'app-consignment-lots',
  templateUrl: './lots.component.html',
  styleUrls: ['./lots.component.scss'],
})
export class LotsComponent implements OnInit, OnDestroy {
  private static readonly lotsControlName = 'lots';

  @Input() lots: LotDto[] = [];
  @Input() chargeableWeight: number;
  @Input() isNew: boolean;
  @Input() editable = true;
  @Input() parentForm: FormGroup;

  @Output()
  onSave: EventEmitter<Array<LotDto>> = new EventEmitter<Array<LotDto>>();

  @Output()
  onDelete: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  onPrint: EventEmitter<LotDto> = new EventEmitter<LotDto>();

  lotFormArray: FormArray;
  emptyLot: LotDto;
  errors: HttpErrorResponse;

  weightSum: number;
  cbmSum: number;

  quantityTypes: FormSelectItem<QuantityType>[];
  lotGroups: FormSelectItem<LotGroup>[];
  classifications: FormSelectItem<Classification>[];

  private unsubscribe = new Subject<void>();

  faCubes = faCubes;
  faCheck = faCheck;
  faTrashAlt = faTrashAlt;
  faTimes = faTimes;
  faEdit = faEdit;
  faQrcode = faQrcode;

  editedLot: { lot: LotDto; index: number };
  columnNumber = 15;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private consignmentsFormService: ConsignmentFormsService
  ) {}

  ngOnInit(): void {
    this.emptyLot = ConsignmentFormsService.createEmptyLot();
    this.resetEditedLot();
    this.quantityTypes = this.consignmentsFormService.getLotQuantityTypes();
    this.lotGroups = this.consignmentsFormService.getLotGroups();
    this.classifications = this.consignmentsFormService.getLotClassifications();
    this.calculateSum();
    this.buildForm();
  }

  private calculateSum(): void {
    [this.cbmSum, this.weightSum] = this.lots.reduce(
      (acc, item) => {
        return [
          Number(acc[0]) + Number(item.cbm),
          Number(acc[1]) + Number(item.weight),
        ];
      },
      [0, 0]
    );
  }

  addLot(lot: LotDto): void {
    const newLot: LotDto = {
      ...lot,
    };
    this.lots.push(newLot);
    const lotModel = {};
    Object.keys(newLot).forEach((key) => {
      lotModel[key] = [newLot[key]];
    });
    const newLotFormGroup = this.fb.group(lotModel);
    this.lotFormArray.push(newLotFormGroup);
    newLotFormGroup.markAsDirty();
    this.calculateSum();
    this.resetEditedLot();
  }

  delLot(lot: LotDto, index: number): void {
    this.resetEditedLot();
    this.lots.splice(index, 1);
    this.lotFormArray.removeAt(index);
    this.parentForm.get(LotsComponent.lotsControlName).markAsDirty();
    this.calculateSum();
  }

  private refresh(response: ConsignmentDto) {
    this.lots = response.consignmentBasicData.lots;
    this.calculateSum();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  editLot(lot: LotDto, index: number): void {
    this.editedLot = { lot, index };
  }

  saveModifiedLot(lot: LotDto): void {
    this.lots[this.editedLot.index] = lot;
    this.lotFormArray.controls[this.editedLot.index].patchValue(lot);
    this.lotFormArray.controls[this.editedLot.index].markAsDirty();
    this.resetEditedLot();
    // TODO: call backend
  }

  private resetEditedLot(): void {
    this.editedLot = { lot: null, index: -1 };
  }

  discardLotEdit() {
    this.resetEditedLot();
  }

  private buildForm() {
    this.lotFormArray = this.fb.array(
      this.lots.map((lot) => {
        const lotModel = {};
        Object.keys(lot).forEach((key) => {
          lotModel[key] = [lot[key]];
        });
        return this.fb.group(lotModel);
      })
    );
    this.parentForm.setControl(
      LotsComponent.lotsControlName,
      this.lotFormArray
    );
  }

  qr(lot: LotDto) {
    this.onPrint.emit(lot);
  }
}
