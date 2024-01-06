import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateOrderInteractor } from './warehouse/domain/interactors/update-order.interactor';
import { UpdateOrderInPort } from './warehouse/domain/ports/in/update-order.in-port';
import { Module } from '@nestjs/common';
import { SaveWarehouseOutPort } from './warehouse/domain/ports/out/save-warehouse.out-port';
import { AddOrderInPort } from './warehouse/domain/ports/in/add-order.in-port';
import { AddOrderInteractor } from './warehouse/domain/interactors/add-order.interactor';
import { CreateWarehouseInPort } from './warehouse/domain/ports/in/create-warehouse.in-port';
import { CreateWarehouseInteractor } from './warehouse/domain/interactors/create-warehouse.interactor';
import { GetWarehouseWithOrdersOutPort } from './warehouse/domain/ports/out/get-warehouse-with-orders.out-port';
import { GetWarehouseWithOrderOutPort } from './warehouse/domain/ports/out/get-warehouse-with-order.out-port';
import { OrderOrmEntity } from './warehouse/dal/orm-entities/order.orm-entity';
import { WarehouseController } from './warehouse/warehouse.controller';
import { WarehouseOrmEntity } from './warehouse/dal/orm-entities/warehouse.orm-entity';
import { WarehouseRepository } from './warehouse/dal/warehouse.repository';
import { UowModule } from 'src/unit-of-work/uow.module';
import { TypeOrmUnitOfWork } from 'src/unit-of-work/uow';
import { SaveReportOutPort } from 'src/accounting/report/domain/ports/out/save-report.out-port';
import { AccountingModule } from 'src/accounting/accounting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WarehouseOrmEntity, OrderOrmEntity]),
    UowModule,
    AccountingModule,
  ],
  controllers: [WarehouseController],
  providers: [
    WarehouseRepository,
    {
      provide: UpdateOrderInPort,
      useFactory: (a, b, c, d) => new UpdateOrderInteractor(a, b, c, d),
      inject: [
        SaveWarehouseOutPort,
        GetWarehouseWithOrderOutPort,
        TypeOrmUnitOfWork,
        SaveReportOutPort,
      ],
    },
    {
      provide: CreateWarehouseInPort,
      useFactory: (a) => new CreateWarehouseInteractor(a),
      inject: [SaveWarehouseOutPort],
    },
    {
      provide: AddOrderInPort,
      useFactory: (a, b) => new AddOrderInteractor(a, b),
      inject: [GetWarehouseWithOrdersOutPort, SaveWarehouseOutPort],
    },
    {
      provide: GetWarehouseWithOrdersOutPort,
      useClass: WarehouseRepository,
    },
    {
      provide: GetWarehouseWithOrderOutPort,
      useClass: WarehouseRepository,
    },
    {
      provide: SaveWarehouseOutPort,
      useClass: WarehouseRepository,
    },
  ],
})
export class WarehouseModule {}
