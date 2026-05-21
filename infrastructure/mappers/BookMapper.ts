import { Book } from '../../domain/models/Book';

export class BookMapper {
  static toDomain(raw: any): Book {
    return new Book(raw.id, raw.title, raw.availableCopies);
  }

  static toPersistence(book: Book): any {
    return {
      id: book.id,
      title: book.title,
      availableCopies: book.availableCopies,
    };
  }
}