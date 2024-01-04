import { WarehouseEntity } from '../domain/entities/warehouse.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { WarehouseMapper } from './warehouse.mapper';
import { SaveWarehouseOutPort } from '../domain/ports/out/save-warehouse.out-port';
import { Injectable } from '@nestjs/common';
import { GetWarehouseWithOrderOutPort } from '../domain/ports/out/get-warehouse-with-order.out-port';
import { GetWarehouseWithOrdersOutPort } from '../domain/ports/out/get-warehouse-with-orders.out-port';
import { WarehouseOrmEntity } from './orm-entities/warehouse.orm-entity';

@Injectable()
export class WarehouseRepository
  implements
    SaveWarehouseOutPort,
    GetWarehouseWithOrdersOutPort,
    GetWarehouseWithOrderOutPort
{
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(WarehouseOrmEntity)
    private whRepository: Repository<WarehouseOrmEntity>,
  ) {}

  async getWarehouseWithOrderPort(
    warehouseId: string,
    orderId: string,
  ): Promise<WarehouseEntity> {
    const whOrm = await this.whRepository
      .createQueryBuilder('warehouses')
      .leftJoinAndSelect('warehouses.orders', 'orders')
      .where('warehouses.id = :warehouseId', { warehouseId })
      .andWhere('orders.id = :orderId', { orderId })
      .getOne();
    return WarehouseMapper.mapToDomain(whOrm);
  }

  async getWarehouseWithOrdersPort(
    warehouseId: string,
  ): Promise<WarehouseEntity> {
    const whOrm = await this.whRepository.findOne({
      where: {
        id: warehouseId,
      },
      relations: {
        orders: true,
      },
    });
    return WarehouseMapper.mapToDomain(whOrm);
  }

  async saveWarehouse(
    warehouse: WarehouseEntity,
    manager?: EntityManager,
  ): Promise<WarehouseEntity> {
    const warehouseORM = WarehouseMapper.mapToORM(warehouse);

    if (manager !== undefined) {
      const updatedWh = await manager.save(warehouseORM);
      return WarehouseMapper.mapToDomain(updatedWh);
    }
    const whOrm = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager.save(warehouseORM);
      },
    );
    return WarehouseMapper.mapToDomain(whOrm);
  }
}
