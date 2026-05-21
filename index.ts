import express from 'express';
import { PrismaLoanRepository } from './infrastructure/repositories/PrismaLoanRepository';
import { PrismaBookRepository } from './infrastructure/repositories/PrismaBookRepository';
import { BorrowBookHandler } from './application/commands/borrow-book/BorrowBookHandler';
import { BorrowBookHandlerSync } from './application/commands/borrow-book/BorrowBookHandlerSync'; 
import { BorrowBookCommand } from './application/commands/borrow-book/BorrowBookCommand'; 
import { LoanController } from './presentation/controllers/LoanController';
import { PrismaClient } from '@prisma/client';
import { GetAvailableBooksHandler } from './application/queries/get-available-books/GetAvailableBooksHandler';
import { GetAvailableBooksQuery } from './application/queries/get-available-books/GetAvailableBooksQuery';
import { EventBus } from './infrastructure/events/EventBus';
import { EmailNotificationService } from './infrastructure/notifications/EmailNotificationService';
import { NotificationSubscriber } from './application/subscribers/NotificationSubscriber';

const app = express();
app.use(express.json());

const bookRepo = new PrismaBookRepository();
const loanRepo = new PrismaLoanRepository();

const eventBus = new EventBus();
const notificationService = new EmailNotificationService();
const notificationSubscriber = new NotificationSubscriber(eventBus, notificationService);

const borrowBookHandler = new BorrowBookHandler(bookRepo, loanRepo, eventBus);
const loanController = new LoanController(borrowBookHandler);

const borrowBookHandlerSync = new BorrowBookHandlerSync(bookRepo, loanRepo, notificationService);

const prisma = new PrismaClient();
const getAvailableBooksHandler = new GetAvailableBooksHandler(prisma);


app.post('/api/loans', (req, res) => loanController.borrowBook(req, res));

app.post('/api/loans/sync', async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    const command = new BorrowBookCommand(bookId, userId);
    await borrowBookHandlerSync.execute(command);
    res.status(201).send({ message: "Book loaned successfully (Synchronous)" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/books/available', async (req, res) => {
  try {
    const query = new GetAvailableBooksQuery();
    const books = await getAvailableBooksHandler.execute(query);
    res.status(200).json(books);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
  });
}

export default app;