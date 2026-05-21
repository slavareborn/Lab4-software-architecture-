import { DomainError } from '../errors/DomainError';

export class Loan {
  private constructor(
    public readonly id: string,
    public readonly bookId: string,
    public readonly userId: string,
    public readonly borrowDate: Date,
    public readonly dueDate: Date,
    public returnDate: Date | null
  ) {}

  static reconstitute(id: string, bookId: string, userId: string, borrowDate: Date, dueDate: Date, returnDate: Date | null): Loan {
    return new Loan(id, bookId, userId, borrowDate, dueDate, returnDate);
  }

  static create(id: string, bookId: string, userId: string, borrowDate: Date, dueDate: Date): Loan {
    if (dueDate <= borrowDate) {
      throw new DomainError('Дата повернення має бути пізнішою за дату видачі.');
    }
    return new Loan(id, bookId, userId, borrowDate, dueDate, null);
  }

  returnBook(date: Date): void {
    if (this.returnDate !== null) {
      throw new DomainError('Ця книга вже була повернута.');
    }
    if (date < this.borrowDate) {
      throw new DomainError('Дата фактичного повернення не може бути раніше дати видачі.');
    }
    this.returnDate = date;
  }
}