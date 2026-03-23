/**
 * Integration test setup — mocks the pg-based database layer so that
 * supertest can exercise the full Express middleware / controller / service /
 * model stack without a running PostgreSQL instance.
 *
 * Every model ultimately calls `query()` or `pool.connect()` from
 * `src/config/database`. We mock that module and expose helpers that let
 * individual tests dictate what the "database" returns for each SQL pattern.
 */

// ── Types ───────────────────────────────────────────────────────────

export interface MockQueryRule {
  /** Substring or regex that must match the SQL text */
  match: string | RegExp;
  /** Rows the query should resolve with */
  rows: Record<string, unknown>[];
  /** Optional rowCount override (defaults to rows.length) */
  rowCount?: number;
  /** If true, the rule is consumed after first match (default: false) */
  once?: boolean;
}

// ── State ───────────────────────────────────────────────────────────

let queryRules: MockQueryRule[] = [];

/**
 * Register one or more rules that define how `query()` should respond.
 * Rules are evaluated **in order** — the first match wins.
 * If a rule has `once: true`, it is removed after it matches once.
 */
export function mockQuery(...rules: MockQueryRule[]): void {
  queryRules.push(...rules);
}

/** Remove all registered query rules (call in afterEach). */
export function resetQueryMocks(): void {
  queryRules = [];
}

// ── Mock implementation ─────────────────────────────────────────────

function findMatchingRule(sql: string): MockQueryRule | undefined {
  const idx = queryRules.findIndex((rule) => {
    if (typeof rule.match === 'string') {
      return sql.includes(rule.match);
    }
    return rule.match.test(sql);
  });
  if (idx === -1) return undefined;

  const rule = queryRules[idx];
  // By default, consume the rule so the next call with the same SQL
  // will match the next rule in the queue. This prevents greedy matching.
  if (rule.once !== false) {
    queryRules.splice(idx, 1);
  }
  return rule;
}

function executeQuery(sql: string, _params?: unknown[]) {
  const rule = findMatchingRule(sql);
  if (rule) {
    return Promise.resolve({
      rows: rule.rows,
      rowCount: rule.rowCount ?? rule.rows.length,
    });
  }
  // Default: empty result set (prevents unhandled errors for incidental queries)
  return Promise.resolve({ rows: [], rowCount: 0 });
}

// Mock client returned by pool.connect() — used in transactions (OrderModel.create)
const mockClient = {
  query: jest.fn((sql: string, params?: unknown[]) => executeQuery(sql, params)),
  release: jest.fn(),
};

// ── Apply the mock BEFORE any module imports the real database config ─

jest.mock('../../src/config/database', () => ({
  query: jest.fn((sql: string, params?: unknown[]) => executeQuery(sql, params)),
  pool: {
    query: jest.fn((sql: string, params?: unknown[]) => executeQuery(sql, params)),
    connect: jest.fn(() => Promise.resolve(mockClient)),
    on: jest.fn(),
    end: jest.fn(),
  },
}));

// Also mock Stripe so that payment / webhook routes don't blow up
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ client_secret: 'pi_test_secret' }),
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

// Reset between tests
afterEach(() => {
  resetQueryMocks();
  mockClient.query.mockClear();
  mockClient.release.mockClear();
});
