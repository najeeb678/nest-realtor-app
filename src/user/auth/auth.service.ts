import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
interface SignupParams {
  name: string;
  phone: string;
  email: string;
  password: string;
}
interface SiginParams {
  email: string;
  password: string;
}
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  private generateJwtToken(name: string, id: number) {
    return jwt.sign({ name, id }, process.env.JSON_TOKEN_KEY, {
      expiresIn: '1h',
    });
  }

  async signup({ email, password, name, phone }: SignupParams) {
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });
    console.log('userExists', userExists);
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('hashedPassword11', hashedPassword);
    const user = await this.prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        user_type: UserType.BUYER,
      },
    });
    return this.generateJwtToken(user.name, user.id);
  }

  async signin({ email, password }: SiginParams) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 400);
    }
    return this.generateJwtToken(user.name, user.id);
  }
}
