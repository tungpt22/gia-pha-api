import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';

@Module({
    providers: [SendEmailService],
    exports: [SendEmailService], // Export it so other modules can import it
})
export class SendEmailModule {}