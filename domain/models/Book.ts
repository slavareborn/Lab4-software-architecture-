import { DomainError } from '../errors/DomainError';

export class Book {
  constructor(
    public readonly id: string,
    public title: string,
    public availableCopies: number
  ) {}

  canBeBorrowed(): boolean {
    return this.availableCopies > 0;
  }

  decreaseCopies(): void {
    if (!this.canBeBorrowed()) {
      throw new DomainError('Немає доступних примірників цієї книги.');
    }
    this.availableCopies -= 1;
  }

  increaseCopies(): void {
    this.availableCopies += 1;
  }
}