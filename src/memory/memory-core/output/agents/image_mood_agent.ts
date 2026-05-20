export interface ImageMoodAgent {
  invoke(imageFile: Buffer): Promise<string>;
}
