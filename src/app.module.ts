import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/dataAccess/database/database.module';

@Module({
  imports: [DatabaseModule],
})
export class AppModule {}
