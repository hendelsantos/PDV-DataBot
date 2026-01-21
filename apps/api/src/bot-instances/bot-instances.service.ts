import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBotInstanceDto, UpdateBotInstanceDto, UpdateBotConfigDto } from './dto/bot-instance.dto';

@Injectable()
export class BotInstancesService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    let instance = await this.prisma.botInstance.findFirst({
      where: { userId },
      include: { config: true },
    });

    // Se não existe, cria uma instância padrão
    if (!instance) {
      instance = await this.prisma.botInstance.create({
        data: {
          userId,
          config: {
            create: {
              welcomeMessage: 'Olá! Bem-vindo ao nosso atendimento. Como posso ajudar?',
              menuItems: [],
              businessHours: { enabled: false },
              autoReply: true,
            },
          },
        },
        include: { config: true },
      });
    }

    return instance;
  }

  async findOne(userId: string, id: string) {
    const instance = await this.prisma.botInstance.findFirst({
      where: { id, userId },
      include: { config: true },
    });

    if (!instance) {
      throw new NotFoundException('Bot instance not found');
    }

    return instance;
  }

  async update(userId: string, id: string, data: UpdateBotInstanceDto) {
    const instance = await this.findOne(userId, id);

    return this.prisma.botInstance.update({
      where: { id: instance.id },
      data,
      include: { config: true },
    });
  }

  async updateConfig(userId: string, instanceId: string, data: UpdateBotConfigDto) {
    const instance = await this.findOne(userId, instanceId);

    if (!instance.config) {
      // Create config if not exists
      return this.prisma.botConfig.create({
        data: {
          botInstanceId: instance.id,
          ...data,
        },
      });
    }

    return this.prisma.botConfig.update({
      where: { botInstanceId: instance.id },
      data,
    });
  }

  async activate(userId: string, id: string) {
    return this.update(userId, id, { isActive: true });
  }

  async deactivate(userId: string, id: string) {
    return this.update(userId, id, { isActive: false });
  }

  async getStats(userId: string, instanceId: string) {
    const instance = await this.findOne(userId, instanceId);

    const [conversations, orders, customers] = await Promise.all([
      this.prisma.conversation.count({
        where: { botInstanceId: instance.id },
      }),
      this.prisma.order.count({
        where: { userId },
      }),
      this.prisma.customer.count({
        where: { userId },
      }),
    ]);

    return {
      totalConversations: conversations,
      totalOrders: orders,
      totalCustomers: customers,
      isActive: instance.isActive,
    };
  }
}
