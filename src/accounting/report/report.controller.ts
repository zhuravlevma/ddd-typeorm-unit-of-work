import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CreateReportInPort } from './domain/ports/in/create-report.in-port';
import { ReportEntity } from './domain/entities/report.entity';
import { FindReportByIdInPort } from './domain/ports/in/find-report-by-id.in-port';
import { ApiTags } from '@nestjs/swagger';
import { UpdateReportInPort } from './domain/ports/in/update-report.in-port';
import { UpdateReportDto } from './dtos/update-report.dto';

@ApiTags('accounting')
@Controller('reports')
export class ReportController {
  constructor(
    private readonly findReportByIdUseCase: FindReportByIdInPort,
    private readonly createReportUseCase: CreateReportInPort,
    private readonly updateReportUseCase: UpdateReportInPort,
  ) {}

  @Get('/:reportId')
  findByReportId(@Param('reportId') id: string): Promise<ReportEntity> {
    return this.findReportByIdUseCase.execute({
      id,
    });
  }

  @Patch('/:reportId')
  updateReport(
    @Param('reportId') reportId: string,
    @Body() updateReportDto: UpdateReportDto,
  ): Promise<ReportEntity> {
    return this.updateReportUseCase.execute({
      reportId,
      isValid: updateReportDto.isValid,
    });
  }
}
