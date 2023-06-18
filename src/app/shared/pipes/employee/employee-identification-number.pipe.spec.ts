import { EmployeeIdentificationNumberPipe } from './employee-identification-number.pipe';

describe('EmployeeIdentificationNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new EmployeeIdentificationNumberPipe();
    expect(pipe).toBeTruthy();
  });

  it('Gives back undefined if it does not have the ID type', () => {
    const pipe = new EmployeeIdentificationNumberPipe();
    const testDto: Array<EmployeeIdentificationDto> = [];
    const result = pipe.transform(testDto, 'DRIVING_LICENSE');
    expect(result).toBeUndefined(`${result} was received`);
  });
  it('Gives back undefined if it does not have the ID type', () => {
    const pipe = new EmployeeIdentificationNumberPipe();
    const testDto: Array<EmployeeIdentificationDto> = [
      {
        expire: '2022.02.02',
        idNumber: 'abcd12345678',
        idType: 'PASSPORT',
      },
    ];
    const result = pipe.transform(testDto, 'DRIVING_LICENSE');
    expect(result).toBeUndefined(`${result} was received`);
  });

  it('Gives back correct number if it has the ID type', () => {
    const pipe = new EmployeeIdentificationNumberPipe();
    const testID = 'abcd12345678';
    const testDto: Array<EmployeeIdentificationDto> = [
      {
        expire: '2022.02.02',
        idNumber: testID,
        idType: 'PASSPORT',
      },
    ];
    const result = pipe.transform(testDto, 'PASSPORT');
    expect(result).toBe(testID, `${result} was received`);
  });

  it('Gives back correct number if it has the ID type', () => {
    const pipe = new EmployeeIdentificationNumberPipe();
    const testPassportID = 'qwer12345678';
    const testID = 'abcd12345678';
    const testLicenseID = 'yxcv12345678';

    const testDto: Array<EmployeeIdentificationDto> = [
      {
        expire: '2022.02.02',
        idNumber: testPassportID,
        idType: 'PASSPORT',
      },
      {
        expire: '2022.05.12',
        idNumber: testLicenseID,
        idType: 'DRIVING_LICENSE',
      },
      {
        expire: '2022.12.02',
        idNumber: testID,
        idType: 'IDENTITY',
      },
    ];

    const resultPassport = pipe.transform(testDto, 'PASSPORT');
    expect(resultPassport).toBe(
      testPassportID,
      `${resultPassport} was received instead ${testPassportID}`
    );
    const resultLicense = pipe.transform(testDto, 'DRIVING_LICENSE');
    expect(resultLicense).toBe(
      testLicenseID,
      `${resultLicense} was received instead ${testLicenseID}`
    );
    const result = pipe.transform(testDto, 'IDENTITY');
    expect(result).toBe(testID, `${result} was received instead ${testID}`);
  });
});
