import { Book } from '../models/Book';
import { Loan } from '../models/Loan';

export interface IBookRepository {
  findById(id: string): Promise<Book | null>;
  save(book: Book): Promise<void>;
}

export interface ILoanRepository {
  findById(id: string): Promise<Loan | null>;
  save(loan: Loan): Promise<void>;
}