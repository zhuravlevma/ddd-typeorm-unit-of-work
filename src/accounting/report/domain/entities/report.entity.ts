import { ReportPositionEntity } from './report-position.entity';

interface Attributes {
  id: string;
  isValid: boolean;
  orderId: string;
  positions: ReportPositionEntity[];
}

export class ReportEntity implements Attributes {
  id: string;
  isValid: boolean;
  orderId: string;
  positions: ReportPositionEntity[];

  constructor(attributes: Attributes) {
    this.id = attributes.id;
    this.isValid = attributes.isValid;
    this.orderId = attributes.orderId;
    this.positions = attributes.positions;
  }

  updateReportStatus(status: boolean) {
    if (status === true) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }
}
