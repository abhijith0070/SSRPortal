import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const { CF_R2_ENDPOINT, CF_ACCESS_KEY_ID, CF_SECRET_ACCESS_KEY } = process.env;

// @ts-ignore
const s3Client = new S3Client({
  region: 'auto',
  endpoint: CF_R2_ENDPOINT,
  credentials: {
    accessKeyId: CF_ACCESS_KEY_ID,
    secretAccessKey: CF_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.CF_R2_STORAGE_BUCKET_NAME;

export async function POST(req: Request) {

  const { fileName, fileType } = await req.json();

  try {
    const key = fileName.replace(/\s/g, '_');

    // Check if the object already exists
    // try {
    //   const headCommand = new HeadObjectCommand({
    //     Bucket: BUCKET_NAME,
    //     Key: key,
    //   });
    //   await s3Client.send(headCommand);
    //   // If no error is thrown, the object exists
    //   return new Response(
    //     JSON.stringify({ message: 'Object already exists', key, code: 'OBJECT_EXISTS' }),
    //     { status: 200 },
    //   );
    // } catch (err) {
    //   if(err.name !== 'NotFound') {
    //     console.error('Error checking object existence:', err);
    //     return new Response(
    //       JSON.stringify({ message: 'Failed to check object existence' }),
    //       { status: 500 },
    //     );
    //   }
    //   // Object does not exist, proceed with generating a presigned URL
    // }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return new Response(JSON.stringify({ presignedUrl, key }), { status: 200 });
  } catch (error) {
    console.error('S3 Presigned URL Error:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to generate presigned URL' }),
      { status: 500 },
    );
  }
}
