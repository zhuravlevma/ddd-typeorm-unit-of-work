import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BillOfLadingMapper as ReportMapper } from './report.mapper';
import { FindReportByIdOutPort } from '../domain/ports/out/find-report-by-id.out-port';
import { SaveReportOutPort } from '../domain/ports/out/save-report.out-port';
import { ReportEntity } from '../domain/entities/report.entity';
import { ReportOrmEntity } from './orm-entities/report.orm-entity';

@Injectable()
export class ReportRepository
  implements FindReportByIdOutPort, SaveReportOutPort
{
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(ReportOrmEntity)
    private reportRepository: Repository<ReportOrmEntity>,
  ) {}
  async findReportById(reportId: string): Promise<ReportEntity> {
    const [order] = await this.reportRepository.find({
      where: { id: reportId },
      relations: {
        positions: true,
      },
    });
    return ReportMapper.mapToDomain(order);
  }

  async save(
    report: ReportEntity,
    manager?: EntityManager,
  ): Promise<ReportEntity> {
    const reportOrm = ReportMapper.mapToOrm(report);

    if (manager !== undefined) {
      const savedReport = await manager.save(reportOrm);
      return ReportMapper.mapToDomain(savedReport);
    }
    const savedReport = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager.save(reportOrm);
      },
    );
    return ReportMapper.mapToDomain(savedReport);
  }
}
