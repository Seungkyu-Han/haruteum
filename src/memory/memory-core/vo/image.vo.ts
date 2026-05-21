export class ImageVO {
  constructor(
    public readonly filename: string,
    public readonly buffer: Buffer,
    public readonly url: string,
  ) {}
}
