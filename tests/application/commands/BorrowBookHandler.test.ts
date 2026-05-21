import { BorrowBookHandler } from '../../..//application/commands/borrow-book/BorrowBookHandler';
import { BorrowBookCommand } from '../../..//application/commands/borrow-book/BorrowBookCommand';
import { Book } from '../../..//domain/models/Book';

describe('BorrowBookHandler', () => {
  it('повинен успішно створити та зберегти позику', async () => {
    const availableBook = new Book('book-1', 'Dune', 5);

    const mockBookRepo = {
      findById: jest.fn().mockResolvedValue(availableBook),
      save: jest.fn(),
    };

    const mockLoanRepo = {
      save: jest.fn(), 
    };

    const handler = new BorrowBookHandler(mockBookRepo as any, mockLoanRepo as any);
    const command = new BorrowBookCommand('user-1', 'book-1');

    await handler.execute(command);

    expect(mockLoanRepo.save).toHaveBeenCalledTimes(1);
  });

  it('повинен кинути помилку, якщо книги не існує', async () => {
    const mockBookRepo = {
      findById: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
    };
    const mockLoanRepo = { save: jest.fn() };

    const handler = new BorrowBookHandler(mockBookRepo as any, mockLoanRepo as any);
    const command = new BorrowBookCommand('user-1', 'book-invalid');

    await expect(handler.execute(command)).rejects.toThrow("Книгу не знайдено.");
    
    expect(mockLoanRepo.save).not.toHaveBeenCalled();
  });
});