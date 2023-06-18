import { employeeSearch } from './employeeSearch';

describe('Employee search function', () => {
  const testEmployee: EmployeeDto = {
    companyId: 'abcd12345678',
    email: 'test@email.com',
    employeeIdentification: undefined,
    firstName: 'abcd',
    lastName: 'Ábécédé',
    phone: '123123123',
  };

  it('should find string in first name', () => {
    expect(employeeSearch('ab', testEmployee)).toBeTrue();
  });
  it('should find string in first name even if difference in capitalization', () => {
    expect(employeeSearch('AbC', testEmployee)).toBeTrue();
  });
  it('should find string in first name even if difference in accents', () => {
    expect(employeeSearch('ábcd', testEmployee)).toBeTrue();
  });
  it('should find string in last name', () => {
    expect(employeeSearch('bécé', testEmployee)).toBeTrue();
  });
  it('should find string in last name even if difference in capitalization', () => {
    expect(employeeSearch('bÉCé', testEmployee)).toBeTrue();
  });
  it('should find string in last name even if difference in accents', () => {
    expect(employeeSearch('beCE', testEmployee)).toBeTrue();
  });
  it('should find full name in firstname-lastname order', () => {
    expect(employeeSearch('abcd Ábécédé', testEmployee)).toBeTrue();
  });
  it('should find full name in lastname-firstname order', () => {
    expect(employeeSearch('Ábécédé abcd', testEmployee)).toBeTrue();
  });
  it('should not find other text', () => {
    expect(employeeSearch('test', testEmployee)).toBeFalse();
  });
});
