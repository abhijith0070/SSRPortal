import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { auth } from '@/lib/auth';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export async function POST(req: Request) {
  try {
    console.log('Upload API called');
    
    const session = await auth();
    if (!session?.user?.id) {
      console.log('Upload API: Unauthorized - no session');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('Upload API: User authenticated:', session.user.id);
    await mkdir(UPLOAD_DIR, { recursive: true });
    console.log('Upload API: Directory created/verified:', UPLOAD_DIR);

    const formData = await req.formData();
    const file = formData.get('file') as File;

    console.log('Upload API: File received:', file ? { name: file.name, size: file.size, type: file.type } : 'null');

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif'
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Supported: PDF, DOC, DOCX, PPT, PPTX, MP4, MOV, AVI, JPG, PNG, GIF'
      }, { status: 400 });
    }

    // Enforce size limit manually
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File size exceeds the 50MB limit.'
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    const filepath = join(UPLOAD_DIR, filename);

    console.log('Upload API: Saving file to:', filepath);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/${filename}`;
    console.log('Upload API: File saved successfully, URL:', fileUrl);

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: file.name,
      originalName: file.name,
      type: file.type,
      size: file.size
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({
      success: false,
      error: 'Error uploading file'
    }, { status: 500 });
  }
}

