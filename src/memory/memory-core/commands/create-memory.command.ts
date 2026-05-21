import { ImageVO } from '../vo/image.vo';

export class CreateMemoryCommand {
  constructor(
    public readonly images: ImageVO[],
    public readonly comment: string,
    public readonly createdAt?: Date,
  ) {}
}
