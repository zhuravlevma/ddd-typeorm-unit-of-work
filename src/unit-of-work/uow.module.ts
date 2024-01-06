import { Module } from '@nestjs/common';
import { TypeOrmUnitOfWork } from './uow';

@Module({
  imports: [],
  controllers: [],
  providers: [TypeOrmUnitOfWork],
  exports: [TypeOrmUnitOfWork],
})
export class UowModule {}
