import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, customerId, total, items, paymentMethod, notes } = createOrderDto;

    // Validate stock for all items
    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Produto ${item.name} não encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Estoque insuficiente para ${item.name}. Disponível: ${product.stock}`,
        );
      }
    }

    // Create order and update stock in a transaction
    const order = await this.prisma.$transaction(async (prisma: Prisma.TransactionClient) => {
      // Create order
      const newOrder = await prisma.order.create({
        data: {
          userId,
          customerId,
          total,
          items: items as any,
          paymentMethod,
          notes,
          status: 'PENDING',
        },
        include: {
          customer: true,
        },
      });

      // Update stock for each product
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Create sale record
      await prisma.sale.create({
        data: {
          userId,
          orderId: newOrder.id,
          total,
          items: items as any,
          paymentMethod,
        },
      });

      return newOrder;
    });

    return order;
  }

  async findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCustomer(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderStatusDto.status,
      },
      include: {
        customer: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
