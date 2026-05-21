import { ILoanRepository } from '../../domain/interfaces/repositories';
import { Loan } from '../../domain/models/Loan';
import { LoanMapper } from '../mappers/LoanMapper';
import prisma from '../database/prismaClient';

export class PrismaLoanRepository implements ILoanRepository {
  async findById(id: string): Promise<Loan | null> {
    const raw = await prisma.loan.findUnique({ where: { id } });
    if (!raw) return null;
    return LoanMapper.toDomain(raw);
  }

  async save(loan: Loan): Promise<void> {
    const data = LoanMapper.toPersistence(loan);
    await prisma.loan.upsert({
      where: { id: loan.id },
      update: data,
      create: data,
    });
  }
}