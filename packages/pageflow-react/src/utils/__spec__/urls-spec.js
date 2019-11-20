import {ensureProtocol} from '../urls';


describe('ensureProtocol', () => {
  test('adds protocol to protocol relative urls', () => {
    expect(ensureProtocol('http', '//example.com')).toBe('http://example.com');
  });

  test('does not change url that has matching protocol', () => {
    expect(ensureProtocol('http', 'http://example.com')).toBe('http://example.com');
  });

  test('does not change url that has other protocol', () => {
    expect(ensureProtocol('http', 'https://example.com')).toBe('https://example.com');
  });

  test('ignores null', () => {
    expect(ensureProtocol('http', null)).toBeNull();
  });
});
