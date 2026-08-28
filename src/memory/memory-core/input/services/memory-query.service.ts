export interface MemoryQueryService {
  existsNextPage(userId: string, memoryId: string): Promise<boolean>;
}
