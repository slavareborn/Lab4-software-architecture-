import { Loan } from '../models/Loan';
import { IBookRepository } from '../interfaces/repositories';
import { DomainError } from '../errors/DomainError';
import crypto from 'crypto';

export class LoanFactory {
  constructor(private bookRepository: IBookRepository) {}

  async createNewLoan(bookId: string, userId: string, daysToBorrow: number): Promise<Loan> {
    const book = await this.bookRepository.findById(bookId);
    
    if (!book) {
      throw new DomainError('Книгу не знайдено.');
    }

    if (!book.canBeBorrowed()) {
      throw new DomainError('Книга недоступна для видачі (немає вільних примірників).');
    }

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + daysToBorrow);

    return Loan.create(crypto.randomUUID(), bookId, userId, borrowDate, dueDate);
  }
}