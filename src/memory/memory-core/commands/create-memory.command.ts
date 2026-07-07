export class CreateMemoryImageCommand {
  constructor(
    public readonly filename: string,
    public readonly buffer: Buffer,
  ) {}
}

export class createMemoryCommentCommand {
  constructor(public readonly comment: string) {}
}

export class CreateMemoryCommand {
  constructor(
    public readonly imageCommands: CreateMemoryImageCommand[],
    public readonly commentCommands: createMemoryCommentCommand[],
    public readonly emotion: string,
    public readonly mode: string,
    public readonly createdAt?: Date,
  ) {}
}
