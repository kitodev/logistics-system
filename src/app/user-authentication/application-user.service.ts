import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationUserService {
  constructor(
    private applicationUserBEService: ApplicationUserBEService,
    private companyBEService: CompanyBEService
  ) {}

  setPassword(
    initialPassword: ApplicationUserInitialPasswordDto
  ): Observable<void> {
    return this.applicationUserBEService.forgetPassword(initialPassword);
  }

  resetPassword(
    initialPassword: ApplicationUserInitialPasswordDto
  ): Observable<void> {
    return this.applicationUserBEService.forgetPassword(initialPassword);
  }

  changePassword(
    changePassword: ApplicationUserPasswordModificationDto
  ): Observable<void> {
    return this.applicationUserBEService.changePassword(changePassword);

  }

  finishPartnerInvite(
    company: CompanyDto,
    companyLogo: File,
    employee: EmployeeDto,
    credentials: InvitePartnerCredentialsDto,
  ): Observable<any> {
    return this.companyBEService.finishPartnerInvite(company, employee, credentials, undefined, companyLogo);

  }

  private static createPartnerFormData(
    companyDto: CompanyDto,
    companyLogo: File,
    employeeDto: EmployeeDto,
    credentials: InvitePartnerCredentialsDto,
  ): FormData {
    const formData = new FormData();
    formData.append(
      'companyDto',
      new Blob([JSON.stringify(companyDto)], {
        type: 'application/json',
      })
    );

    formData.append(
      'employeeDto',
      new Blob([JSON.stringify(employeeDto)], {
        type: 'application/json',
      })
    );

    if (companyLogo && companyLogo.size > 0) {
      formData.append('companyLogo', companyLogo);
    }

    formData.append(
      'credentials',
      new Blob([JSON.stringify(credentials)], {
        type: 'application/json',
      })
    );
    return formData;
  }

}
