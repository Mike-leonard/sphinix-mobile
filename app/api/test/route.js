import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

function getDatabaseTarget() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const url = new URL(process.env.DATABASE_URL);

  return {
    protocol: url.protocol,
    username: url.username,
    host: url.hostname,
    port: url.port || '5432',
    database: url.pathname.replace(/^\//, ''),
    sslmode: url.searchParams.get('sslmode'),
    pgbouncer: url.searchParams.get('pgbouncer'),
  };
}

export async function GET() {
  const target = getDatabaseTarget();

  if (!target) {
    return NextResponse.json(
      { ok: false, error: 'DATABASE_URL is not configured' },
      { status: 500 }
    );
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
  });

  try {
    const result = await pool.query('select 1 as ok');

    return NextResponse.json({
      ok: true,
      target,
      result: result.rows[0],
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        target,
        error: e.message,
        code: e.code,
      },
      { status: 500 }
    );
  } finally {
    await pool.end();
  }
}
