export interface ImageMoodAgent {
  invoke(imageFiles: Buffer[], comment: string): Promise<string>;
}
