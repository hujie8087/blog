import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  @ApiProperty({
    description: '用户手机',
    example: '13888888888',
  })
  readonly username: string;

  @Prop({ required: true })
  @ApiProperty({
    description: '用户密码',
    example: '123456',
  })
  readonly password: string;

  @Prop()
  readonly salt?: string;

  @Prop()
  readonly captcha?: string;

  @Prop()
  readonly captchaId?: string;
}
