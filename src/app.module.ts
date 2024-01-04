import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { DeliveryModule } from './delivery/delivery.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingModule } from './accounting/accounting.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { OrderOrmEntity as WarehouseOrderOrmEntity } from './warehouse/warehouse/dal/orm-entities/order.orm-entity';
import { DeliverymanOrmEntity } from './delivery/deliveryman/dal/orm-entities/deliveryman.orm-entity';
import { OrderOrmEntity } from './delivery/deliveryman/dal/orm-entities/orders.orm-entity';
import { OfferOrmEntity } from './delivery/offer/dal/orm-entities/offer.orm-entity';
import { ReportPositionOrmEntity } from './accounting/report/dal/orm-entities/report-position.orm-entity';
import { ReportOrmEntity } from './accounting/report/dal/orm-entities/report.orm-entity';
import { WarehouseOrmEntity } from './warehouse/warehouse/dal/orm-entities/warehouse.orm-entity';
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
        OrderOrmEntity,
        DeliverymanOrmEntity,
        ReportPositionOrmEntity,
        ReportOrmEntity,
        WarehouseOrmEntity,
        WarehouseOrderOrmEntity,
        OfferOrmEntity,
      ],
      synchronize: true,
      logging: true,
    }),
    AccountingModule,
    DeliveryModule,
    WarehouseModule,
  ],
})
export class AppModule {}
