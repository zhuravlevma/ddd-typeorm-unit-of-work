import { EntityManager } from 'typeorm';
import { WarehouseEntity } from '../../entities/warehouse.entity';

export abstract class SaveWarehouseOutPort {
  abstract saveWarehouse(
    warehouse: WarehouseEntity,
    entityManager?: EntityManager,
  ): Promise<WarehouseEntity>;
}
