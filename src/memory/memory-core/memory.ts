export class Memory {
  private readonly imageFile: Buffer;
  private readonly review: string;
  private readonly createdAt: Date;

  constructor(imageFile: Buffer, review: string) {
    this.imageFile = imageFile;
    this.review = review;
    this.createdAt = new Date();
  }
}
