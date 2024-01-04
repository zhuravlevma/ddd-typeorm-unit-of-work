import { EntityManager } from 'typeorm';
import { ReportEntity } from '../../entities/report.entity';

export abstract class SaveReportOutPort {
  abstract save(
    order: ReportEntity,
    manager?: EntityManager,
  ): Promise<ReportEntity>;
}
