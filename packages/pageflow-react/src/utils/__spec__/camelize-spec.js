import camelize from '../camelize';


describe('camelize', () => {
  test('turns snake case into camel case', () => {
    const result = camelize('in_snake_case');

    expect(result).toBe('inSnakeCase');
  });
});

describe('camelize.keys', () => {
  test('returns object with camelized keys', () => {
    const result = camelize.keys({'in_snake_case': 5});

    expect(result).toEqual({inSnakeCase: 5});
  });
});

describe('camelize.deep', () => {
  test('camelized keys in nested structure', () => {
    const result = camelize.deep({
      'an_array': [{'some_key': 5}],
      'nested_object': {'some_key': 6}
    });

    expect(result).toEqual({
      anArray: [{someKey: 5}],
      nestedObject: {someKey: 6}
    });
  });
});

describe('camelize.concat', () => {
  test('concats camelized strings into a new one', () => {
    const result = camelize.concat('somePrefix', 'forA', 'camelizedString');

    expect(result).toBe('somePrefixForACamelizedString');
  });

  test('skips null parts', () => {
    const result = camelize.concat(null, 'somePrefix', null, 'forA', 'camelizedString');

    expect(result).toBe('somePrefixForACamelizedString');
  });

  test('skips undefined parts', () => {
    const result = camelize.concat(undefined, 'somePrefix', undefined, 'forA', 'camelizedString');

    expect(result).toBe('somePrefixForACamelizedString');
  });

  test('skips empty strings', () => {
    const result = camelize.concat('', 'somePrefix', 'forA', 'camelizedString');

    expect(result).toBe('somePrefixForACamelizedString');
  });
});
