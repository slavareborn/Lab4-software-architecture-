import { IBookRepository } from '../../domain/interfaces/repositories';
import { Book } from '../../domain/models/Book';
import { BookMapper } from '../mappers/BookMapper';
import prisma from '../database/prismaClient';

export class PrismaBookRepository implements IBookRepository {
  async findById(id: string): Promise<Book | null> {
    const raw = await prisma.book.findUnique({ where: { id } });
    if (!raw) return null;
    return BookMapper.toDomain(raw); 
  }

  async save(book: Book): Promise<void> {
    const data = BookMapper.toPersistence(book);
    await prisma.book.upsert({
      where: { id: book.id },
      update: data,
      create: data,
    });
  }
}