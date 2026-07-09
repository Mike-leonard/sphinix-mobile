import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const settingsFile = path.join(process.cwd(), 'data', 'settings.json');
    
    if (!fs.existsSync(settingsFile)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(settingsFile);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    return new NextResponse(fileBuffer, {
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
