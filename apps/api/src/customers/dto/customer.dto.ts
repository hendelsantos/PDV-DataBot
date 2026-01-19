export class CreateCustomerDto {
  userId: string;
  telegramId: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export class UpdateCustomerDto {
  name?: string;
  phone?: string;
  address?: string;
  notes?: string;
}
