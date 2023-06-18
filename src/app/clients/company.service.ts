import { Injectable } from '@angular/core';
import { HttpService } from '../shared/system/http.service';
import { Observable, of, zip } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';
import { FormSelectItem } from '../shared/form/select/FormSelectItem';
import { TranslocoService } from '@ngneat/transloco';

export enum CompanySection {
  DETAILS = 'details',
  PREMISES = 'premises',
  EMPLOYEES = 'employees',
  VEHICLES = 'vehicles',
}

enum Endpoints {
  COMPANY_ENDPOINT = '/company',
  EMPLOYEE_ENDPOINT = '/employee',
  EMPLOYEES_ENDPOINT = '/employees',
  ACCOUNT_NUMBER_ENDPOINT = '/account-number',
  PREMISE_ENDPOINT = '/premise',
  PARTNERS_ENDPOINT = '/partners',
  AGENCY_PARTNERS_ENDPOINT = '/my-partners',
  MY_AGENCY_ENDPOINT = '/my-agency',
  LIST_ENDPOINT = '/list',
  SPECIALIZATION = '/employee-specialization',
  APPLICATION_USER = '/application-user',
  PROMOTE = '/promote',
}

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private myCompany: CompanyDto;

  constructor(
    private applicationUserBEService: ApplicationUserBEService,
    private companyBEService: CompanyBEService,
    private companyEmployeeBEService: CompanyEmployeeBEService,
    private employeeBEService: EmployeeBEService,
    private accountNumberBEService: AccountNumberBEService,
    private premiseBEService: PremiseBEService,
    private translationService: TranslocoService,
    private authService: AuthService) {}

  
  public static getRoute(companyId: string, section: CompanySection): string {
    return `${Endpoints.COMPANY_ENDPOINT}/${companyId}/${section}`;
  }

  invitePartner(email: string): Observable<any> {
    return this.companyBEService.invitePartner(email);
  }

  activateCompany(companyId): Observable<CompanyDto> {
    return this.companyBEService.activate(companyId);
  }

  inactivateCompany(companyId): Observable<string> {
    return this.companyBEService.inactivate(companyId);
  }

  getCompany(companyId: string): Observable<CompanyDto> {
    return this.companyBEService.readCompanyById(companyId);
  }

  getCompanies(query: QueryDto): Observable<PageCompanyFinancialDto> {
    return this.companyBEService.readAllCompaniesByFilter(query);
  }

  getProcessedPartners(): Observable<Array<CompanyDto>> {
    const companyList = this.authService.isAgency()
      ? this.getAgencyPartners()
      : this.getAgencyData().pipe(map((agency) => [agency]));

    return zip(companyList, this.getMyCompany()).pipe(
      map(([companies, myCompany]) => {
        companies.push(myCompany);
        return companies
          .map((company) => {
            if (!company.active) {
              company['disabled'] = true;
            }
            return company;
          })
          .sort((a, b) => {
            if (a.active) {
              return -1;
            } else if (b.active) {
              return 1;
            }
            return 0;
          });
      })
    );
  }

  getMyCompany(): Observable<CompanyDto> {
    return this.myCompany
      ? of(this.myCompany)
      : this.getCompany(this.authService.getOwnCompanyId());
  }

  getPartners(companyId: string): Observable<CompanyDto[]> {
    return this.companyBEService.readPartnerCompaniesByAgencyCompanyId(companyId);
  }

  private getAgencyPartners(): Observable<CompanyDto[]> {
    return this.companyBEService.readPartnerCompaniesByCurrentEmployee();
  }

  private getAgencyData(): Observable<CompanyDto> {
    return this.companyBEService.readAgencyCompanyByCurrentPartnerUser();
  }

  createCompany(
    company: Omit<CompanyDto, 'id' | 'version'>,
    logo: File
  ): Observable<CompanyDto> {
    return this.companyBEService.createCompany(company, undefined, logo);
  }

  updateCompany(company: CompanyDto, logo: File): Observable<CompanyDto> {
    return this.companyBEService.updateCompanyById(company.id, company, undefined, logo);
  }

  getDriversByCompany(companyId: string): Observable<EmployeeDto[]> {
    return this.companyEmployeeBEService.getDriversOfCompany(companyId);
  }

  private static createCompanyFormData(
    company: CompanyDto,
    logo: File
  ): FormData {
    const formData = new FormData();
    formData.append(
      'companyDto',
      new Blob([JSON.stringify(company)], {
        type: 'application/json',
      })
    );

    if (logo && logo.size > 0) {
      formData.append('companyLogo', logo);
    }
    return formData;
  }

  deleteCompany(companyId: string): Observable<unknown> {
    return this.companyBEService.deleteCompanyById(companyId);
  }

  getBankAccounts(companyId: string): Observable<AccountNumberDto[]> {
    return this.accountNumberBEService.readAllAccountNumbersByCompanyId(companyId);
  }

  createBankAccount(
    companyId: string,
    account: Omit<AccountNumberDto, 'id' | 'version'>
  ): Observable<AccountNumberDto> {
    return this.accountNumberBEService.createAccountNumber(companyId, account);
  }

  updateBankAccount(
    companyId: string,
    account: AccountNumberDto
  ): Observable<AccountNumberDto> {
    return this.accountNumberBEService.updateAccountNumberById(companyId, account.id, account);
  }

  deleteBankAccount(companyId: string, accountId: string): Observable<unknown> {
    return this.accountNumberBEService.deleteAccountNumberById(companyId, accountId);
  }

  createPremise(
    companyId: string,
    premise: Omit<PremiseDto, 'id' | 'version'>
  ): Observable<CompanyDto> {
    return this.premiseBEService.createPremise(companyId, premise);
  }

  getPremises(companyId: string): Observable<PremiseDto[]> {
    return this.premiseBEService.readAllPremisesByCompanyId(companyId);
  }

  getPremiseById(companyId: string, premiseId: string): Observable<PremiseDto> {
    return this.premiseBEService.readPremiseById(companyId, premiseId);
  }

  updatePremise(
    companyId: string,
    premise: PremiseDto
  ): Observable<PremiseDto> {
    return this.premiseBEService.updatePremiseById(companyId, premise.id, premise);
  }

  deletePremise(companyId: string, premiseId: string): Observable<unknown> {
    return this.premiseBEService.deletePremiseById(companyId, premiseId);
  }

  getPremiseEmployees(
    companyId: string,
    premiseId: string
  ): Observable<ContactOfPremiseDto[]> {
    return this.premiseBEService.listContactsOfPremise(companyId, premiseId);
  }

  addPremiseContactEmployee(
    companyId: string,
    premiseId: string,
    contactId: string
  ): Observable<CompanyDto> {
    return this.premiseBEService.addEmployeeToPremiseContacts(companyId, premiseId, contactId);
  }

  deletePremiseContactEmployee(
    companyId: string,
    premiseId: string,
    contactId: string
  ): Observable<CompanyDto> {
    return this.premiseBEService.removeEmployeeFromPremiseContacts(companyId, premiseId, contactId);
  }

  createEmployee(
    companyId: string,
    employee: Omit<EmployeeDto, 'id' | 'version'>
  ): Observable<EmployeeDto> {
    return this.companyEmployeeBEService.createEmployee(companyId, employee);
  }

  getEmployeeById(employeeId: string): Observable<EmployeeDto> {
    return this.employeeBEService.readEmployeeById(employeeId);
  }

  getDepartmentPositionMatrix(): Observable<{
    [key: string]: Position[];
  }> {
    return this.employeeBEService.listDepartmentToPositions();
  }

  addSpecialization(
    employeeId: string,
    spec: EmployeeSpecializationDto
  ): Observable<EmployeeDto> {
    return this.employeeBEService.addEmployeeSpecialization(employeeId, spec);
  }

  deleteSpecialization(
    employeeId: string,
    specId: string
  ): Observable<EmployeeDto> {
    return this.employeeBEService.removeEmployeeSpecialization(employeeId, specId);
  }

  getEmployees(companyId: string): Observable<EmployeeDto[]> {
    return this.companyEmployeeBEService.readAllEmployeesByCompanyId(companyId);
  }

  getAllEmployees(query: QueryDto): Observable<PageEmployeeCompanyDto> {
    return this.employeeBEService.readAllEmployeesByFilter(query);
  }

  getPossibleAddressees(query: QueryDto): Observable<PageEmployeeCompanyDto> {
    return this.employeeBEService.listBidderNominee(query);
  }

  updateEmployee(employee: EmployeeDto): Observable<EmployeeDto> {
    return this.employeeBEService.updateEmployeeById(employee.id, employee);
  }

  deleteEmployee(employeeId: string): Observable<unknown> {
    return this.employeeBEService.deleteEmployeeById(employeeId);
  }

  inviteUser(employeeId: string): Observable<string> {
    return this.applicationUserBEService.createUser(employeeId);
  }

  disableUser(employeeId: string): Observable<void> {
    return this.applicationUserBEService.disableUser(employeeId);
  }

  activateUser(employeeId: string): Observable<void> {
    return this.applicationUserBEService.activateUser(employeeId);
  }

  resetPassword(employeeId: string): Observable<void> {
    return this.applicationUserBEService.resetPassword(employeeId);
  }

  promoteCompany(companyId: string): Observable<void> {
    return this.companyBEService.promotePartnerCompanyToAgencyById(companyId);
  }
}
