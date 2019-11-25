import isBlank from '../isBlank';


describe('isBlank', () => {
  test('returns true for empty string', () => {
    const result = isBlank('');

    expect(result).toBe(true);
  });

  test('returns false for string with characters', () => {
    const result = isBlank(' abc  ');

    expect(result).toBe(false);
  });

  test('returns true for whitespace', () => {
    const result = isBlank('  \t\n');

    expect(result).toBe(true);
  });

  test('returns true for null', () => {
    const result = isBlank(null);

    expect(result).toBe(true);
  });

  test('returns true for undefined', () => {
    const result = isBlank(undefined);

    expect(result).toBe(true);
  });

  test('returns true for html tags that only contain whitespace', () => {
    const result = isBlank('<p>  <br /> <i>\n</i></p>');

    expect(result).toBe(true);
  });

  test(
    'returns true for not wellformed html tags that only contain whitespace',
    () => {
      const result = isBlank('<p>  <br>\t<i></p>');

      expect(result).toBe(true);
    }
  );

  test(
    'returns false for html tags that contain non whitespace characters',
    () => {
      const result = isBlank('<p>  <i>Some text</i></p>');

      expect(result).toBe(false);
    }
  );
});
