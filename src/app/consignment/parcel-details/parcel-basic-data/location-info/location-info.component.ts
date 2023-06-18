import { Component, Input, OnInit } from '@angular/core';
import { CompanyService } from '../../../../clients/company.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons/faPhoneAlt';
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons/faMobileAlt';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faFax } from '@fortawesome/free-solid-svg-icons/faFax';

@Component({
  selector: 'app-location-info',
  templateUrl: './location-info.component.html',
  styleUrls: ['./location-info.component.scss'],
})
export class LocationInfoComponent implements OnInit {
  @Input()
  companies: Array<CompanyDto> = [];
  @Input()
  location: LocationDto;

  locationCompany: CompanyDto;
  contactEmployee: EmployeeDto;
  private unsubscribe: Subject<void> = new Subject();

  faPhone = faPhoneAlt;
  faEnvelope = faEnvelope;
  faFax = faFax;
  faMobile = faMobileAlt;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.locationCompany = this.companies.find(
      (company) => company.id === this.location.companyId
    );
    this.companyService
      .getEmployeeById(this.location.contactPersonId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((employee) => {
        this.contactEmployee = employee;
      });
  }
}
