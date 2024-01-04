interface Attributes {
  id: string;
  name: string;
  orderId: string;
  deliverymanId: string | null;
}

export class OfferEntity implements Attributes {
  id: string;
  name: string;
  orderId: string;
  deliverymanId: string | null;

  constructor(attributes: Attributes) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.orderId = attributes.orderId;
    this.deliverymanId = attributes.deliverymanId;
  }

  deliverymanTakeOffer(deliverymanId: string) {
    this.deliverymanId = deliverymanId;
  }
}
