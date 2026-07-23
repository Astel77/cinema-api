import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExternalService } from './external.service';
import { ExternalController } from './external.controller';

@Module({
  imports: [HttpModule.register({ timeout: 8000 })],
  controllers: [ExternalController],
  providers: [ExternalService],
})
export class ExternalModule {}
