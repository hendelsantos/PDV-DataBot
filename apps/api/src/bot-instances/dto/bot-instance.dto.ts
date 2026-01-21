import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateBotInstanceDto {
  @IsString()
  @IsOptional()
  botToken?: string;
}

export class UpdateBotInstanceDto {
  @IsString()
  @IsOptional()
  botToken?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateBotConfigDto {
  @IsString()
  @IsOptional()
  welcomeMessage?: string;

  @IsOptional()
  menuItems?: any[];

  @IsOptional()
  businessHours?: {
    enabled: boolean;
    start?: string;
    end?: string;
    days?: number[];
  };

  @IsBoolean()
  @IsOptional()
  autoReply?: boolean;
}
