const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send('API системи управління бібліотекою успішно працює! 🚀');
});

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Немає токена' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Невалідний токен' });
    }
};

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Невалідний email' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Користувач вже існує' }); // 409 Conflict
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword }
        });
        res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Невірний email або пароль' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Create
app.post('/api/books', authenticate, async (req, res) => {
    const { title, year } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Назва не може бути порожньою' });
    }
    const currentYear = new Date().getFullYear();
    if (!year || year > currentYear) {
        return res.status(400).json({ error: 'Рік видання не може бути в майбутньому' });
    }

    const book = await prisma.book.create({
        data: { title, year, ownerId: req.user.userId }
    });
    res.status(201).json(book);
});

// Read
app.get('/api/books', authenticate, async (req, res) => {
    const books = await prisma.book.findMany({
        where: { ownerId: req.user.userId }
    });
    res.json(books);
});

// Update
app.put('/api/books/:id', authenticate, async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, year } = req.body;

    const existingBook = await prisma.book.findUnique({ where: { id } });
    if (!existingBook) return res.status(404).json({ error: 'Книгу не знайдено' }); // 404 Not Found
    
    if (existingBook.ownerId !== req.user.userId) return res.status(403).json({ error: 'Заборонено' });

    const book = await prisma.book.update({
        where: { id },
        data: { title, year }
    });
    res.json(book);
});

// Delete
app.delete('/api/books/:id', authenticate, async (req, res) => {
    const id = parseInt(req.params.id);
    const existingBook = await prisma.book.findUnique({ where: { id } });
    
    if (!existingBook) return res.status(404).json({ error: 'Книгу не знайдено' });
    if (existingBook.ownerId !== req.user.userId) return res.status(403).json({ error: 'Заборонено' });

    await prisma.book.delete({ where: { id } });
    res.status(204).send();
});

module.exports = app;