import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException('Product key is required');
      }
      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      const isValidKey = await bcrypt.compare(validProductKey, body.productKey);
      if (!isValidKey) {
        throw new UnauthorizedException('Invalid product key');
      }
    }
    return this.authService.signup(body);
  }
  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }
  @Post('/key')
  generateProductKey(@Body() { UserType, email }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(UserType, email);
  }
}
