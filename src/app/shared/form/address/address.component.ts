import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { countryCodes } from './countryCodes';
import { streetTypes } from './streetTypes';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  TRANSLOCO_SCOPE,
  TranslocoScope,
  TranslocoService,
} from '@ngneat/transloco';
import { counties } from './counties';

@Component({
  selector: 'form-address',
  templateUrl: './address.component.html',
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: 'countries', alias: 'countries' },
    },
  ],
})
export class AddressComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup;
  @Input() disabled = false;

  control: FormControl;

  countries: Array<Array<string | Array<string>>> = countryCodes;
  streetTypes: Array<string>;

  private unsubscribe = new Subject<void>();
  counties: Array<string> = [];
  // noinspection JSNonASCIINames
  unique = this.constructor['ɵcmp'].id;

  constructor(
    private translationService: TranslocoService,
    @Inject(TRANSLOCO_SCOPE) private scope: TranslocoScope
  ) {}

  ngOnInit(): void {
    this.translationService.langChanges$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.sortCountryList();
      });

    this.setStreetType(this.formGroup.controls.country.value);

    this.formGroup.controls['country'].valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((newVal) => {
        this.setStreetType(newVal);
      });
  }

  private setStreetType(countryCode): void {
    if (countryCode == 'HU') {
      this.streetTypes = streetTypes.HU;
      this.counties = counties.HU;
    } else {
      this.streetTypes = streetTypes.EN;
      this.counties = [];
    }
  }

  private sortCountryList() {
    this.translationService
      // subscribing to a translation ensures that the countries language file is present when we sort
      .selectTranslate('HU', null, this.scope)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.countries.forEach((countries) => {
          (countries[1] as []).sort((a, b) => {
            return this.translationService
              .translate('countries.' + a)
              .localeCompare(
                this.translationService.translate('countries.' + b)
              );
          });
        });
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
