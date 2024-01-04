import { UnitOfWork } from 'src/unit-of-work/uow';
import { ReportEntity } from '../entities/report.entity';
import {
  UpdateReprotCommand as UpdateReportDto,
  UpdateReportInPort,
} from '../ports/in/update-report.in-port';
import { FindReportByIdOutPort } from '../ports/out/find-report-by-id.out-port';
import { SaveReportOutPort } from '../ports/out/save-report.out-port';
import { randomUUID } from 'crypto';
import { OfferEntity } from 'src/delivery/offer/domain/entities/offer.entity';
import { SaveOfferOutPort } from 'src/delivery/offer/domain/ports/out/save-offer.out-port';

export class UpdateReportInteractor implements UpdateReportInPort {
  constructor(
    private readonly findReportById: FindReportByIdOutPort,
    private readonly saveReportPort: SaveReportOutPort,
    private readonly saveOfferOutPort: SaveOfferOutPort,
    private readonly uow: UnitOfWork,
  ) {}

  async execute(updatePositionDto: UpdateReportDto): Promise<ReportEntity> {
    const report = await this.findReportById.findReportById(
      updatePositionDto.reportId,
    );

    if (updatePositionDto.isValid === true) {
      report.updateReportStatus(updatePositionDto.isValid);
      const offer = new OfferEntity({
        id: randomUUID(),
        name: 'Report with ' + report.orderId,
        orderId: report.orderId,
        deliverymanId: null,
      });

      return this.uow.doTransactional(async (tx) => {
        const updatedReport = await this.saveReportPort.save(report, tx);
        await this.saveOfferOutPort.saveOffer(offer, tx);
        return updatedReport;
      });
    }

    return this.saveReportPort.save(report);
  }
}
