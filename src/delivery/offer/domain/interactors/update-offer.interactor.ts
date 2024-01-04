import { SaveOfferOutPort } from '../ports/out/save-offer.out-port';
import { OfferEntity } from '../entities/offer.entity';
import {
  UpdateOfferCommand,
  UpdateOfferInPort,
} from '../ports/in/update-offer.in-port';
import { FindOfferByIdOutPort } from '../ports/out/find-offer-by-id.out-port';
import { UnitOfWork } from 'src/unit-of-work/uow';
import { FindDeliverymanByIdWithOrdersOutPort } from 'src/delivery/deliveryman/domain/ports/out/find-deliveryman-by-id-with-orders.out-port';
import { SaveDeliverymanOutPort } from 'src/delivery/deliveryman/domain/ports/out/save-deliveryman.out-port';
import { OrderEntity } from 'src/delivery/deliveryman/domain/entities/order.entity';
import { randomUUID } from 'crypto';

export class UpdateOfferInteractor implements UpdateOfferInPort {
  constructor(
    private readonly findOfferByIdPort: FindOfferByIdOutPort,
    private readonly saveOfferPort: SaveOfferOutPort,
    private readonly uow: UnitOfWork,
    private readonly findDeliverymanByIdWithOrdersPort: FindDeliverymanByIdWithOrdersOutPort,
    private readonly saveDeliverymanPort: SaveDeliverymanOutPort,
  ) {}

  async execute(updateOfferCommand: UpdateOfferCommand): Promise<OfferEntity> {
    try {
      const offer = await this.findOfferByIdPort.findOfferByIdPort(
        updateOfferCommand.offerId,
      );

      if (updateOfferCommand.deliverymanId !== undefined) {
        offer.deliverymanTakeOffer(updateOfferCommand.deliverymanId);

        const deliverymanWithOrders =
          await this.findDeliverymanByIdWithOrdersPort.findDeliverymanByIdWithOrders(
            updateOfferCommand.deliverymanId,
          );

        deliverymanWithOrders.addOrder(
          new OrderEntity({
            id: randomUUID(),
            name: 'test name',
            description: 'test descr',
            isActive: false,
            orderId: offer.orderId,
            deliverymanId: updateOfferCommand.deliverymanId,
          }),
        );

        return this.uow.doTransactional(async (tx) => {
          const updatedOffer = await this.saveOfferPort.saveOffer(offer, tx);
          this.saveDeliverymanPort.save(deliverymanWithOrders, tx);
          return updatedOffer;
        });
      }

      return this.saveOfferPort.saveOffer(offer);
    } catch (error) {
      return error.message;
    }
  }
}
