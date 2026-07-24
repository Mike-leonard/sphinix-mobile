import { NextResponse } from 'next/server';
import { verifySession } from '@/actions/auth';
import { getSettings } from '@/actions/settings';

export async function GET() {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'Admin') {
      return new NextResponse('Unauthorized. Admin access required.', { status: 401 });
    }

    const settings = await getSettings();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonString = JSON.stringify(settings, null, 2);
    
    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="sphinix-backup-${timestamp}.json"`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error downloading backup:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
