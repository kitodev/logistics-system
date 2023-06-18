import { CompanyService } from '../app/clients/company.service';

import { Observable, of } from 'rxjs';

export const companyServiceMock: Partial<CompanyService> = {
  getCompany(companyId: string): Observable<CompanyDto> {
    return of(testCompany);
  },
  createCompany: (company: Omit<CompanyDto, 'id' | 'version'>, logo: File) =>
    of(company),
  getCompanies: () => {
    const companies: PageCompanyFinancialDto = {
      number: 1,
      content: [testFinancialCompany],
    };
    return of(companies);
  },
  deleteCompany: (id) => of(id),
  createEmployee: jasmine.createSpy('create employee'),
  getEmployeeById: (employeeId) => of(testEmployee),
  getEmployees: () => of([testEmployee]),
  deleteEmployee: jasmine.createSpy('delete employee'),
  getAllEmployees: () => of({ number: 1, content: [testEmployee] }),
  getPremiseById: () => of(testPremise),
  getPremises: () => of([]),
  getPremiseEmployees: () => of([]),
  getPossibleAddressees: () => of({ number: 1, content: [testEmployee] }),
  getDepartmentPositionMatrix: () => {
    return of(testMatrix);
  },
  getPartners: () => of([testCompany]),
  getProcessedPartners: () => of([testCompany]),
  invitePartner(email: string): Observable<any> {
    return of(email);
  },
  createBankAccount: jasmine.createSpy('create'),
  getBankAccounts: () => {
    return of(accounts);
  },
  updateBankAccount: jasmine.createSpy('update'),
  deleteBankAccount: jasmine.createSpy('delete'),
};

const testCompany: CompanyDto = {
  companyName: 'Test Ltd.',
  phone: '12345678',
  registrationNumber: '445566778899',
  taxNumber: '55442201111',
  email: 'test@test.com',
  companyProfiles: [],
  billingElectronic: true,
  billingPaymentDeadlineDays: 30,
  billingLanguage: BillingLanguage.hu,
  billingPaymentMethod: PaymentMethod.TRANSFER,
  mailingAddress: {
    country: 'HU',
    county: 'PEST',
    city: 'Vác',
    postCode: '2600',
    streetName: 'Dr. Csányi László',
    streetType: 'körút',
    streetNumber: '12A',
  },
  premises: [
    {
      companyId: '1234',
      name: 'Seat address',
      openingDays: { MONDAY: { openFrom: '08:00', openTo: '17:00' } },
      premiseType: PremiseType.SEAT,
      address: {
        country: 'HU',
        city: 'Budapest',
        postCode: '1000',
        county: 'Budapest',
        streetName: 'Városház',
        streetType: 'tér',
        streetNumber: '12a',
      },
    },
  ],
};

const testFinancialCompany: CompanyFinancialDto = {
  companyName: 'Test Ltd.',
  phone: '12345678',
  registrationNumber: '445566778899',
  taxNumber: '55442201111',
  email: 'test@test.com',
  companyProfiles: [],
  mailingAddress: {
    country: 'HU',
    county: 'PEST',
    city: 'Vác',
    postCode: '2600',
    streetName: 'Dr. Csányi László',
    streetType: 'körút',
    streetNumber: '12A',
  },
  seatAddress: {
    country: 'HU',
    city: 'Budapest',
    postCode: '1000',
    county: 'Budapest',
    streetName: 'Városház',
    streetType: 'tér',
    streetNumber: '12a',
  },
  premises: [
    {
      companyId: '1234',
      name: 'Seat address',
      openingDays: { MONDAY: { openFrom: '08:00', openTo: '17:00' } },
      premiseType: PremiseType.SEAT,
      address: {
        country: 'HU',
        city: 'Budapest',
        postCode: '1000',
        county: 'Budapest',
        streetName: 'Városház',
        streetType: 'tér',
        streetNumber: '12a',
      },
    },
  ],
};

const testMatrix = {
  [Department.AIR]: [
    Position.ADMINISTRATOR,
    Position.ASSISTANT,
    Position.CLERK,
    Position.MECHANIC,
    Position.DISPATCHER,
    Position.GROUP_LEADER,
  ],
};

const testEmployee: EmployeeDto = {
  companyId: '887997',
  firstName: 'Jane',
  lastName: 'Doe',
  employeeIdentification: [
    {
      idNumber: '123456AB',
      idType: 'passport',
      expire: '2030-01-01',
    },
  ],
  phone: '+36144444445',
  email: 'test@mock.com',
};

const accounts: Array<AccountNumberDto> = [
  {
    accountNumber: '234234234',
    bankName: 'Test Bank',
    companyId: '1111-1111',
    iban: 'TESTGBIK-11111111-22223333-44444444',
    id: '12323',
    swiftCode: 'TESTGBIK',
    currencyIdentifier: 'HUF',
  },
  {
    accountNumber: '9998877665544',
    bankName: 'Dummy Bank',
    companyId: '2222-1111',
    iban: 'TESTGBIK-88888888-22223333-9999999',
    id: '43244234',
    swiftCode: 'TESTFRIK',
    currencyIdentifier: 'HUF',
  },
];

const testPremise: PremiseDto = {
  companyId: '887997',
  name: 'seat',
  premiseType: PremiseType.SEAT,
  address: {
    country: 'HU',
    city: 'Budapest',
    postCode: '1000',
    county: 'Budapest',
    streetName: 'Városház',
    streetType: 'tér',
    streetNumber: '12a',
  },
  openingDays: {},
};
