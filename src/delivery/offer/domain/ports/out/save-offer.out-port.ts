import { EntityManager } from 'typeorm';
import { OfferEntity } from '../../entities/offer.entity';

export abstract class SaveOfferOutPort {
  abstract saveOffer(
    offer: OfferEntity,
    manager?: EntityManager,
  ): Promise<OfferEntity>;
}
