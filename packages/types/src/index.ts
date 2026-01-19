import { z } from 'zod';

// ============================================
// AUTH SCHEMAS
// ============================================

export const RegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

// ============================================
// PRODUCT SCHEMAS
// ============================================

export const ProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser positivo'),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
  category: z.string().optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof ProductSchema>;

// ============================================
// ORDER SCHEMAS
// ============================================

export const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const OrderSchema = z.object({
  customerId: z.string(),
  items: z.array(OrderItemSchema).min(1, 'Pedido deve ter pelo menos 1 item'),
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'OTHER']),
  notes: z.string().optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderInput = z.infer<typeof OrderSchema>;

// ============================================
// BOT CONFIG SCHEMAS
// ============================================

export const MenuItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  action: z.string(),
  order: z.number().int(),
});

export const BusinessHoursSchema = z.object({
  enabled: z.boolean(),
  schedule: z.array(z.object({
    day: z.number().int().min(0).max(6),
    start: z.string(),
    end: z.string(),
  })).optional(),
});

export const BotConfigSchema = z.object({
  welcomeMessage: z.string().min(1),
  menuItems: z.array(MenuItemSchema),
  businessHours: BusinessHoursSchema,
  autoReply: z.boolean(),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;
export type BusinessHours = z.infer<typeof BusinessHoursSchema>;
export type BotConfigInput = z.infer<typeof BotConfigSchema>;

// ============================================
// CUSTOMER SCHEMAS
// ============================================

export const CustomerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  telegramId: z.string().optional(),
});

export type CustomerInput = z.infer<typeof CustomerSchema>;

// ============================================
// ENUMS
// ============================================

export enum Plan {
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  TRIALING = 'TRIALING',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  OTHER = 'OTHER',
}

export enum MessageSender {
  BOT = 'BOT',
  CUSTOMER = 'CUSTOMER',
  HUMAN = 'HUMAN',
}

// ============================================
// PLAN LIMITS
// ============================================

export const PLAN_LIMITS = {
  BASIC: {
    maxMessages: 500,
    maxProducts: 100,
    maxUsers: 1,
    price: 39,
  },
  PROFESSIONAL: {
    maxMessages: -1, // unlimited
    maxProducts: 1000,
    maxUsers: 3,
    price: 99,
  },
  ENTERPRISE: {
    maxMessages: -1,
    maxProducts: -1,
    maxUsers: -1,
    price: 199,
  },
} as const;
