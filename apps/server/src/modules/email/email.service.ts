import { Injectable } from '@nestjs/common';
import { SendEmailParams } from './email.type';

@Injectable()
export class EmailService {
  async send(params: SendEmailParams): Promise<void> {
    console.log(params.content);
  }
}
