import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma, CoverageProvider } from 'generated/prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CoverageProviderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: Prisma.CoverageProviderCreateInput): Promise<CoverageProvider> {
    return this.prisma.coverageProvider.create({ data });
  }

  async update(id: string, data: Prisma.CoverageProviderUpdateInput): Promise<CoverageProvider> {
    return this.prisma.coverageProvider.update({ where: { id }, data });
  }

  async delete(id: string): Promise<CoverageProvider> {
    return this.prisma.coverageProvider.delete({ where: { id } });
  }
}
