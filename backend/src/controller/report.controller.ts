import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from '../service/report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // GET /report/wf-category?yearStart=2560&yearEnd=2573&departmentId=...&programId=...
  @Get('wf-category')
  async getWFCategory(
    @Query('yearStart') yearStart: string,
    @Query('yearEnd') yearEnd: string,
    @Query('departmentId') departmentId?: string,
    @Query('programId') programId?: string,
  ) {
    const ys = parseInt(yearStart, 10);
    const ye = parseInt(yearEnd, 10);
    const dep = departmentId ? parseInt(departmentId, 10) : undefined;
    const prog = programId ? parseInt(programId, 10) : undefined;

    if (!Number.isFinite(ys) || !Number.isFinite(ye)) {
      throw new Error('yearStart and yearEnd are required and must be numbers');
    }

    return this.reportService.getWFPercentageByCategory({
      yearStart: ys,
      yearEnd: ye,
      departmentId: dep,
      programId: prog,
    });
  }

  @Get('wf-category-boxplot')
  async getWFCategoryBoxplot(
    @Query('yearStart') yearStart: string,
    @Query('yearEnd') yearEnd: string,
    @Query('departmentId') departmentId?: string,
    @Query('programId') programId?: string,
  ) {
    const ys = parseInt(yearStart, 10);
    const ye = parseInt(yearEnd, 10);
    const dep = departmentId ? parseInt(departmentId, 10) : undefined;
    const prog = programId ? parseInt(programId, 10) : undefined;
    return this.reportService.getWFBoxplotByCategory({
      yearStart: ys,
      yearEnd: ye,
      departmentId: dep,
      programId: prog,
    });
  }
  @Get('departments')
  async getDepartments() {
    return this.reportService.listDepartments();
  }

  @Get('programs')
  async getPrograms() {
    return this.reportService.listPrograms();
  }
}


