import { BorrowBookCommand } from './BorrowBookCommand';
import { IBookRepository, ILoanRepository } from '../../../domain/interfaces/repositories';
import { LoanFactory } from '../../../domain/factories/LoanFactory';
import { EventBus } from '../../../infrastructure/events/EventBus';
import { BookBorrowedEvent } from '../../../domain/events/BookBorrowedEvent';
import * as crypto from 'crypto'; 

export class BorrowBookHandler {
  constructor(
    private bookRepository: IBookRepository,
    private loanRepository: ILoanRepository,
    private eventBus: EventBus
  ) {}

  async execute(command: BorrowBookCommand): Promise<void> {
    
    const loanFactory = new LoanFactory(this.bookRepository);
    const loan = await loanFactory.createNewLoan(
      command.bookId,
      command.userId,
      14 
    );

    await this.loanRepository.save(loan);
    console.log("[Handler Async] Основна операція: Книгу успішно видано (збережено в БД).");

    const event = new BookBorrowedEvent(
        crypto.randomUUID(),
        command.userId,
        command.bookId
    );
    
    this.eventBus.publish('BookBorrowed', event);
  }
}