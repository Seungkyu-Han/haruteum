export class MemoryUserMismatchException extends Error {
  constructor() {
    super('cant access this memory');
  }
}
