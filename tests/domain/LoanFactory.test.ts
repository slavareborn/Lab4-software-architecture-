import { LoanFactory } from '../../domain/factories/LoanFactory';
import { Book } from '../../domain/models/Book';
import { DomainError } from '../../domain/errors/DomainError';
import { IBookRepository } from '../../domain/interfaces/repositories';

describe('LoanFactory', () => {
  it('повинна кидати помилку, якщо книга недоступна', async () => {
    const unavailableBook = new Book('book-1', 'Чистий код', 0);
    
    const mockBookRepo: IBookRepository = {
      findById: jest.fn().mockResolvedValue(unavailableBook),
      save: jest.fn()
    };
    
    const factory = new LoanFactory(mockBookRepo);
    
    await expect(factory.createNewLoan('book-1', 'user-1', 14))
      .rejects
      .toThrow(DomainError);
      
    await expect(factory.createNewLoan('book-1', 'user-1', 14))
      .rejects
      .toThrow('Книга недоступна для видачі (немає вільних примірників).');
  });
});