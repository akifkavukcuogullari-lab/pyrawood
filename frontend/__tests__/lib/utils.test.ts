import { cn, formatCurrency, formatDate, getInitials, truncate } from '@/lib/utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra');
  });

  it('merges tailwind conflicting classes', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });

  it('handles undefined and null inputs', () => {
    expect(cn('base', undefined, null)).toBe('base');
  });
});

describe('formatCurrency', () => {
  it('formats a whole number as USD', () => {
    expect(formatCurrency(1299)).toBe('$1,299.00');
  });

  it('formats a decimal amount as USD', () => {
    expect(formatCurrency(49.99)).toBe('$49.99');
  });

  it('formats zero as USD', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats large amounts with comma separators', () => {
    expect(formatCurrency(4999)).toBe('$4,999.00');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string', () => {
    const result = formatDate('2025-06-15T12:00:00Z');
    expect(result).toBe('Jun 15, 2025');
  });

  it('formats another date string', () => {
    const result = formatDate('2024-01-01T12:00:00Z');
    expect(result).toBe('Jan 1, 2024');
  });
});

describe('getInitials', () => {
  it('extracts initials from a two-word name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('extracts initials from a single-word name', () => {
    expect(getInitials('John')).toBe('J');
  });

  it('limits to two initials for long names', () => {
    expect(getInitials('John Michael Doe')).toBe('JM');
  });

  it('handles extra spaces in the name', () => {
    expect(getInitials('  Jane   Doe  ')).toBe('JD');
  });

  it('uppercases lowercase names', () => {
    expect(getInitials('jane doe')).toBe('JD');
  });
});

describe('truncate', () => {
  it('returns the full string when shorter than limit', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('truncates with ellipsis when longer than limit', () => {
    expect(truncate('Walnut Harvest Dining Table', 10)).toBe('Walnut Har...');
  });

  it('returns the full string when equal to limit', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('trims trailing space before appending ellipsis', () => {
    expect(truncate('Hello World', 6)).toBe('Hello...');
  });
});
