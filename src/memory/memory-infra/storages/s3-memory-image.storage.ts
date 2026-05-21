import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { MemoryImageStorage } from '../../memory-core/output/storages/memory-image.storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3MemoryImageStorage implements MemoryImageStorage {
  private readonly s3EndPoint: string | undefined;
  private readonly s3Region: string;
  private readonly s3Client: S3Client;
  private readonly bucketName = 'haruteum';
  constructor(
    s3EndPoint: string | undefined,
    s3Region: string,
    s3AccessKeyId: string,
    s3SecretAccessKey: string,
  ) {
    this.s3EndPoint = s3EndPoint;
    this.s3Client = new S3Client({
      endpoint: s3EndPoint,
      region: s3Region,
      credentials: {
        accessKeyId: s3AccessKeyId,
        secretAccessKey: s3SecretAccessKey,
      },
      forcePathStyle: true,
    });
  }
  async saveImage(imageFile: Buffer): Promise<string> {
    const fileExtension = '.jpg';
    const fileName = `${uuidv4()}${fileExtension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: imageFile,
        ContentType: `image/${fileExtension}`,
      }),
    );

    if (this.s3EndPoint) {
      return `${this.s3EndPoint}/${this.bucketName}/${fileName}`;
    } else {
      return `https://${this.bucketName}.s3.${this.s3Region}.amazonaws.com/${fileName}`;
    }
  }
}
