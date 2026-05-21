import { Loan } from '../../domain/models/Loan';

export class LoanMapper {
  static toDomain(raw: any): Loan {
    return Loan.reconstitute(
      raw.id,
      raw.bookId,
      raw.userId,
      raw.borrowDate,
      raw.dueDate,
      raw.returnDate
    );
  }

  static toPersistence(loan: Loan): any {
    return {
      id: loan.id,
      bookId: loan.bookId,
      userId: loan.userId,
      borrowDate: loan.borrowDate,
      dueDate: loan.dueDate,
      returnDate: loan.returnDate,
    };
  }
}