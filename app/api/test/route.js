import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  
  let result = "Failed";
  try {
    const prisma = new PrismaClient({ adapter });
    result = "Success";
  } catch (e) {
    result = e.message;
  }
  
  return NextResponse.json({
    hasPrismaPg: !!PrismaPg,
    adapterConstructor: adapter?.constructor?.name,
    result
  });
}
