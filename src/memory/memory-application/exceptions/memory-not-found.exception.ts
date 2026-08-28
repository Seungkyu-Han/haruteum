export class MemoryNotFoundException extends Error {
  constructor(memoryId: string) {
    super(`${memoryId} memory is not exist`);
  }
}
