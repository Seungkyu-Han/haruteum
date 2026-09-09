export interface INameGenerator {
  generateName(): Promise<string>;
}
