import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConsignmentFormsService } from '../../../consignment-forms.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons/faExchangeAlt';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons/faMoneyBillWave';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { LocationType } from '../../LocationType';

interface LocationItem {
  location: LocationDto;
  formGroup: FormGroup;
}

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'],
})
export class LocationsListComponent implements OnInit, OnDestroy {
  @Input()
  locations: Array<LocationDto>;
  @Input()
  consignmentId: string;
  @Input()
  consignmentVersion: number;
  @Input()
  partners: Array<CompanyDto>;
  @Input()
  legs?: Array<LegDto>;
  @Output()
  dirty: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  valid: EventEmitter<boolean> = new EventEmitter<boolean>();

  locationList: Array<LocationItem>;

  private unsubscribe: Subject<void> = new Subject<void>();
  readonly locationControlName: string = 'location';

  listChanged = false;

  LocationType = LocationType;

  faMoneyBillWave = faMoneyBillWave;
  faExchange = faExchangeAlt;
  faTrashAlt = faTrashAlt;
  faUp = faArrowUp;
  faDown = faArrowDown;
  faPlusSquare = faPlusSquare;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.locationList = this.locations?.map((location) => {
      const formGroup: FormGroup = this.fb.group({});
      formGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.setAndEmitStatus();
      });
      return {
        location,
        formGroup,
      };
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  add(index: number): void {
    const location = ConsignmentFormsService.createEmptyLocation();
    location.freightId = this.consignmentId;
    location.rootVersion = this.consignmentVersion;

    const locationFormGroup = this.fb.group({});
    locationFormGroup.markAsDirty();
    locationFormGroup.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.setAndEmitStatus();
      });
    this.locationList.splice(index, 0, {
      location,
      formGroup: locationFormGroup,
    });
    this.setListDirty();
  }

  remove(locationPosition: number): void {
    this.locationList.splice(locationPosition, 1);
    this.setListDirty();
  }

  moveDown(locationPosition: number): void {
    this.locationList.splice(
      locationPosition + 1,
      0,
      this.locationList.splice(locationPosition, 1)[0]
    );
    this.setListDirty();
  }

  moveUp(locationPosition: number): void {
    this.locationList.splice(
      locationPosition - 1,
      0,
      this.locationList.splice(locationPosition, 1)[0]
    );
    this.setListDirty();
  }

  public getLocationsValue(): Array<LocationDto> {
    return this.locationList.map(
      (location) => location.formGroup.get(this.locationControlName).value
    );
  }

  public markAsPristine(): void {
    this.locationList.forEach((location) => {
      location.formGroup.markAsPristine();
    });
    this.listChanged = false;
    this.setAndEmitStatus();
  }

  private setAndEmitStatus(): void {
    let valid = true;
    let dirty = false;
    this.locationList.forEach((location) => {
      if (location.formGroup.dirty === true) {
        dirty = true;
      }
      if (location.formGroup.valid === false) {
        valid = false;
      }
    });
    this.dirty.emit(dirty || this.listChanged);
    this.valid.emit(valid);
  }

  private setListDirty(): void {
    this.listChanged = true;
    this.dirty.emit(true);
  }
}
