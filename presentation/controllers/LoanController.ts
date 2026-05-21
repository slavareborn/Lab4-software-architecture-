import { Request, Response } from 'express';
import { BorrowBookCommand } from '../../application/commands/borrow-book/BorrowBookCommand';
import { BorrowBookHandler } from '../../application/commands/borrow-book/BorrowBookHandler';

export class LoanController {
  constructor(private borrowBookHandler: BorrowBookHandler) {}

  async borrowBook(req: Request, res: Response) {
    try {
      const command = new BorrowBookCommand(req.body.bookId, req.body.userId);
      
      await this.borrowBookHandler.execute(command);
      
      res.status(201).json({ message: "Книгу успішно видано" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}