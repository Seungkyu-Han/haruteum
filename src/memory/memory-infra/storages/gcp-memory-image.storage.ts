import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { MemoryImageStorage } from '../../memory-core/output/storages/memory-image.storage';
import { randomUUID } from 'crypto';

@Injectable()
export class GcpMemoryImageStorage implements MemoryImageStorage {
  private readonly storage: Storage;
  private readonly bucketName: string;

  constructor(bucketName: string, keyFilename?: string) {
    if (keyFilename) {
      this.storage = new Storage({
        keyFilename: keyFilename,
      });
    } else {
      this.storage = new Storage();
    }

    this.bucketName = bucketName;
  }

  async saveImage(filename: string, buffer: Buffer): Promise<string> {
    const ext = filename.split('.').pop()?.toLowerCase();
    const uuidFileName = ext ? `${randomUUID()}.${ext}` : randomUUID();

    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(uuidFileName);

    return new Promise((resolve, reject) => {
      const writeStream = file.createWriteStream({
        resumable: false,
        metadata: {
          contentType: this.getContentType(filename),
        },
      });

      writeStream.on('error', (error) => {
        reject(
          new InternalServerErrorException(
            `Failed to upload image to GCS: ${error.message}`,
          ),
        );
      });

      writeStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${uuidFileName}`;
        resolve(publicUrl);
      });

      writeStream.end(buffer);
    });
  }

  private getContentType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'webp':
        return 'image/webp';
      case 'gif':
        return 'image/gif';
      default:
        return 'application/octet-stream';
    }
  }
}
