export class BorrowBookCommand {
  constructor(
    public readonly userId: string,
    public readonly bookId: string
  ) {}
}