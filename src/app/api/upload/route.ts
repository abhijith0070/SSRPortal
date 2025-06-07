import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { auth } from '@auth';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return new NextResponse('Invalid file type. Only PDF and images are allowed.', { status: 400 });
    }

    // Enforce size limit manually
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return new NextResponse('File size exceeds the 10MB limit.', { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    const filepath = join(UPLOAD_DIR, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      url: fileUrl,
      filename: file.name,
      type: file.type
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return new NextResponse('Error uploading file', { status: 500 });
  }
}
