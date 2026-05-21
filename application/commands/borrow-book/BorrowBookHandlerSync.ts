import { BorrowBookCommand } from './BorrowBookCommand';
import { IBookRepository, ILoanRepository } from '../../../domain/interfaces/repositories';
import { LoanFactory } from '../../../domain/factories/LoanFactory';
import { INotificationService } from '../../interfaces/INotificationService';

export class BorrowBookHandlerSync {
  constructor(
    private bookRepository: IBookRepository,
    private loanRepository: ILoanRepository,
    private notificationService: INotificationService
  ) {}

  async execute(command: BorrowBookCommand): Promise<void> {

    const loanFactory = new LoanFactory(this.bookRepository);

    const loan = await loanFactory.createNewLoan(
      command.bookId,
      command.userId,
      14 
    );

    await this.loanRepository.save(loan);
    console.log("[Handler Sync] Основна операція: Книгу успішно видано (збережено в БД).");

    try {
        console.log(`[Handler Sync] Викликаємо NotificationService для користувача ${command.userId}...`);

        await this.notificationService.sendLoanNotification(command.userId, command.bookId);
        
    } catch (error) {
        console.error("[Handler Sync] Помилка відправки нотифікації. Але транзакцію не відкочуємо.", error);
    }
  }
}