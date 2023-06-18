import * as en from '../assets/i18n/en.json';
import * as hu from '../assets/i18n/hu.json';

function flatten(obj: unknown) {
  return Object.assign(
    {},
    ...(function _flatten(o) {
      return [].concat(
        ...Object.keys(o).map((k) =>
          typeof o[k] === 'object' ? _flatten(o[k]) : { [k]: o[k] }
        )
      );
    })(obj)
  );
}

describe('Dictionary', () => {
  it('English keys should match with Hungarian keys', () => {
    const huFlat = flatten(hu);
    const enFlat = flatten(en);

    const huKeys = Object.keys(huFlat);
    const enKeys = Object.keys(enFlat);

    huKeys.forEach((key) => {
      expect(enFlat[key]).not.toBe(
        undefined,
        `${key} is not found in English dictionary`
      );
    });

    enKeys.forEach((key) => {
      expect(huFlat[key]).not.toBe(
        undefined,
        `${key} is not found in Hungarian dictionary`
      );
    });
  });
});
