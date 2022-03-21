import { getSpudDateFilter } from '../getSpudDateFilter';

describe('getSpudDateFilter', () => {
  it('should return empty object with empty input', () => {
    expect(getSpudDateFilter([])).toEqual({});
  });

  it('should return expected object with valid input', () => {
    expect(getSpudDateFilter(['min', 'max'])).toEqual({
      spudDate: { min: 'min', max: 'max' },
    });
  });

  it('should return empty object with invalid input', () => {
    expect(getSpudDateFilter([200125, 36541])).toEqual({});
  });

  // this test will fail in locally due to timezone difference
  it('should return expected object with valid date inputs', () => {
    const minDate = new Date(1000000000);
    const maxDate = new Date();
    expect(getSpudDateFilter([minDate, maxDate])).toEqual({
      spudDate: { min: minDate.toISOString(), max: maxDate.toISOString() },
    });
  });
});
