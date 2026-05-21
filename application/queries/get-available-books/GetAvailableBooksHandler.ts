import { PrismaClient } from '@prisma/client';
import { GetAvailableBooksQuery } from './GetAvailableBooksQuery';
import { BookReadModel } from './BookReadModel';

export class GetAvailableBooksHandler {
  constructor(private prisma: PrismaClient) {}

  async execute(query: GetAvailableBooksQuery): Promise<BookReadModel[]> {
    const rawBooks = await this.prisma.book.findMany({
      where: {
        availableCopies: { gt: 0 }
      },
      take: query.limit,
      skip: query.offset,
      select: {
        id: true,
        title: true,
        availableCopies: true
      }
    });

    return rawBooks;
  }
}