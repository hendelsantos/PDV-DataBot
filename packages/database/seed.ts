import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test user
  const hashedPassword = await bcrypt.hash('senha123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'teste@botpdv.com' },
    update: {},
    create: {
      email: 'teste@botpdv.com',
      password: hashedPassword,
      name: 'Usuário Teste',
      phone: '11999999999',
    },
  });

  console.log('✅ User created:', user.email);

  // Create subscription
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 30);

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      plan: 'PROFESSIONAL',
      status: 'ACTIVE',
      currentPeriodEnd: trialEnd,
    },
  });

  console.log('✅ Subscription created');

  // Delete existing products for this user
  await prisma.product.deleteMany({
    where: { userId: user.id },
  });

  // Create products
  const products = [
    {
      name: 'Pizza Margherita',
      description: 'Pizza tradicional com molho de tomate, mussarela e manjericão',
      price: 45.90,
      stock: 50,
      category: 'Pizzas',
      isActive: true,
    },
    {
      name: 'Pizza Calabresa',
      description: 'Pizza com calabresa, cebola e azeitonas',
      price: 48.90,
      stock: 50,
      category: 'Pizzas',
      isActive: true,
    },
    {
      name: 'Refrigerante 2L',
      description: 'Coca-Cola 2 litros',
      price: 12.00,
      stock: 100,
      category: 'Bebidas',
      isActive: true,
    },
    {
      name: 'Suco Natural',
      description: 'Suco de laranja natural 500ml',
      price: 8.50,
      stock: 30,
      category: 'Bebidas',
      isActive: true,
    },
    {
      name: 'Batata Frita',
      description: 'Porção de batata frita crocante',
      price: 18.00,
      stock: 40,
      category: 'Porções',
      isActive: true,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        userId: user.id,
      },
    });
  }

  console.log('✅ Products created:', products.length);

  // Save userId to file for bot configuration
  const fs = require('fs');
  fs.writeFileSync('/tmp/botpdv_user_id.txt', user.id);
  console.log('✅ User ID saved:', user.id);
  console.log('\n📋 Credentials:');
  console.log('   Email: teste@botpdv.com');
  console.log('   Password: senha123');
  console.log('   User ID:', user.id);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
