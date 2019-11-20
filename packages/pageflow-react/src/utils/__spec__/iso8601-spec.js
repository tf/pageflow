import {formatTimeDuration} from '../iso8601';

import {expect} from 'support/chai';

describe('timeDuration', () => {
  const seconds = 1000;
  const minutes = seconds * 60;
  const hours = minutes * 60;

  test('formats seconds long duration', () => {
    const result = formatTimeDuration(6 * seconds);

    expect(result).toBe('PT6S');
  });

  test('rounds seconds long duration', () => {
    const result = formatTimeDuration(6 * seconds + 120);

    expect(result).toBe('PT6S');
  });

  test('formats minute long duration', () => {
    const result = formatTimeDuration(10 * minutes + 59 * seconds);

    expect(result).toBe('PT10M59S');
  });

  test('formats hour long duration', () => {
    const result = formatTimeDuration(3 * hours + 10 * minutes + 59 * seconds);

    expect(result).toBe('PT3H10M59S');
  });

  test('skips zero components', () => {
    const result = formatTimeDuration(3 * hours);

    expect(result).toBe('PT3H');
  });

  test('formats zero correctly', () => {
    const result = formatTimeDuration(0);

    expect(result).toBe('PT0S');
  });
});
