import { UserType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsDefined,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignupDto {
  @IsDefined({ message: 'name is required' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'phone must be a valid phone number',
  })
  @IsString()
  phone: string;

  @IsEmail({}, { message: 'email must be a valid email' })
  @IsString()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey?: string;
}

export class SigninDto {
  @IsEmail({}, { message: 'email must be a valid email' })
  @IsString()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class GenerateProductKeyDto {
  @IsEmail({}, { message: 'email must be a valid email' })
  @IsString()
  email: string;

  @IsEnum(UserType)
  UserType: UserType;
}
