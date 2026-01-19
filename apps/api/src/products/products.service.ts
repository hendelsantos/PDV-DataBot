import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return product;
  }

  async update(userId: string, id: string, updateProductDto: UpdateProductDto) {
    // Verify ownership
    await this.findOne(userId, id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(userId: string, id: string) {
    // Verify ownership
    await this.findOne(userId, id);

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async updateStock(userId: string, id: string, quantity: number) {
    const product = await this.findOne(userId, id);

    return this.prisma.product.update({
      where: { id },
      data: {
        stock: product.stock + quantity,
      },
    });
  }
}
