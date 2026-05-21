import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../../index';

const prisma = new PrismaClient();

describe('Integration Test: Отримання доступних книг (Query)', () => {
  beforeAll(async () => {
    await prisma.book.deleteMany(); 
    
    await prisma.book.createMany({
      data: [
        { id: '1', title: '1984', availableCopies: 3 },
        { id: '2', title: 'Кобзар', availableCopies: 0 }, 
        { id: '3', title: 'Dune', availableCopies: 1 },
      ]
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /books/available повинен повертати лише книги з availableCopies > 0', async () => {
    const response = await request(app).get('/books/available');

    expect(response.status).toBe(200);
    
    expect(Array.isArray(response.body)).toBeTruthy();
    
    expect(response.body.length).toBe(2); 

    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('title');
    expect(response.body[0]).toHaveProperty('availableCopies');
  });
});