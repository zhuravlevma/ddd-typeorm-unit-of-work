import { EntityManager } from 'typeorm';
import { DeliverymanEntity } from '../../entities/deliveryman.entity';

export abstract class SaveDeliverymanOutPort {
  abstract save(
    deliveryman: DeliverymanEntity,
    manager?: EntityManager,
  ): Promise<DeliverymanEntity>;
}
