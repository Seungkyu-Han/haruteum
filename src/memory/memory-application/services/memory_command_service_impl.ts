import { Injectable } from '@nestjs/common';
import { MemoryCommandService } from '../../memory-core/input/services/memory_command_service';

@Injectable()
export class MemoryCommandServiceImpl implements MemoryCommandService {
  createMemory(imageFile: Buffer, review: string): void {
    console.log('Creating memory with review:', review);
    console.log('Image file size:', imageFile.length, 'bytes');
  }
}
