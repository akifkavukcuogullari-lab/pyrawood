import { Pool, QueryResult, QueryResultRow } from 'pg';

let _pool: Pool | null = null;

function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    _pool.on('error', (err) => {
      console.error('Unexpected error on idle database client', err);
      process.exit(-1);
    });
  }
  return _pool;
}

// Proxy object that lazily initializes the pool
const pool: Pool = new Proxy({} as Pool, {
  get(_target, prop: string | symbol) {
    const realPool = getPool();
    const value = (realPool as any)[prop];
    if (typeof value === 'function') {
      return value.bind(realPool);
    }
    return value;
  },
});

/**
 * Execute a parameterized SQL query against the pool.
 */
async function query<T extends QueryResultRow = any>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const result = await getPool().query<T>(text, params);
  const duration = Date.now() - start;

  if (process.env.NODE_ENV === 'development') {
    console.log('[db] Executed query', { text: text.substring(0, 80), duration: `${duration}ms`, rows: result.rowCount });
  }

  return result;
}

export { pool, query };
