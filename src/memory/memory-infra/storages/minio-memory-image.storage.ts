import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { MemoryImageStorage } from '../../memory-core/output/storages/memory-image.storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MinioMemoryImageStorage implements MemoryImageStorage {
  private readonly localIp: string;
  private readonly s3Region: string = 'ap-northeast-2';
  private readonly s3Client: S3Client;
  private readonly bucketName = 'haruteum';

  constructor(
    localIp: string,
    s3AccessKeyId: string,
    s3SecretAccessKey: string,
  ) {
    this.localIp = localIp;
    this.s3Client = new S3Client({
      endpoint: 'http://127.0.0.1:9000',
      region: this.s3Region,
      credentials: {
        accessKeyId: s3AccessKeyId,
        secretAccessKey: s3SecretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async saveImage(filename: string, buffer: Buffer): Promise<string> {
    const fileExtension = filename.split('.').pop()?.toLowerCase() ?? '';
    const fileName = `${uuidv4()}${fileExtension ? `.${fileExtension}` : ''}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: `image/${fileExtension}`,
      }),
    );

    return `${this.localIp}/${this.bucketName}/${fileName}`;
  }
}
