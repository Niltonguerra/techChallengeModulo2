import { Module } from '@nestjs/common';
import { CommonService } from './services/common.service';
import { CommonController } from './controllers/common.controller';

@Module({
  providers: [CommonService],
  controllers: [CommonController]
})
export class CommonModule {}
