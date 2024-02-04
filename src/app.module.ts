import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingModule } from './accounting/accounting.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { OrderOrmEntity as WarehouseOrderOrmEntity } from './warehouse/dal/orm-entities/order.orm-entity';
import { ReportPositionOrmEntity } from './accounting/dal/orm-entities/report-position.orm-entity';
import { ReportOrmEntity } from './accounting/dal/orm-entities/report.orm-entity';
import { WarehouseOrmEntity } from './warehouse/dal/orm-entities/warehouse.orm-entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config().database.host,
      port: config().database.port,
      username: config().database.username,
      password: config().database.password,
      database: config().database.name,
      entities: [
        ReportPositionOrmEntity,
        ReportOrmEntity,
        WarehouseOrmEntity,
        WarehouseOrderOrmEntity,
      ],
      synchronize: true,
      logging: true,
    }),
    AccountingModule,
    WarehouseModule,
  ],
})
export class AppModule {}
