import { Controller, Get, Param } from '@nestjs/common';
import { ReportEntity } from './domain/entities/report.entity';
import { FindReportByIdInPort } from './domain/ports/in/find-report-by-id.in-port';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('accounting')
@Controller('reports')
export class ReportController {
  constructor(private readonly findReportByIdUseCase: FindReportByIdInPort) {}

  @Get('/:reportId')
  findByReportId(@Param('reportId') id: string): Promise<ReportEntity> {
    return this.findReportByIdUseCase.execute({
      id,
    });
  }
}
