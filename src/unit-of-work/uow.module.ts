import { Module } from '@nestjs/common';
import { UnitOfWork } from './uow';

@Module({
  imports: [],
  controllers: [],
  providers: [UnitOfWork],
  exports: [UnitOfWork],
})
export class UowModule {}
