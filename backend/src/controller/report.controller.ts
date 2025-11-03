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
    @Query('departmentIds') departmentIds?: string,
    @Query('programId') programId?: string,
    @Query('programIds') programIds?: string,
  ) {
    const ys = parseInt(yearStart, 10);
    const ye = parseInt(yearEnd, 10);
    const parseIds = (val?: string) =>
      val ? val.split(',').map((v) => parseInt(v.trim(), 10)).filter((n) => Number.isFinite(n)) : [];
    const depIds = departmentIds?.length ? parseIds(departmentIds) : (departmentId ? parseIds(departmentId) : []);
    const progIds = programIds?.length ? parseIds(programIds) : (programId ? parseIds(programId) : []);

    if (!Number.isFinite(ys) || !Number.isFinite(ye)) {
      throw new Error('yearStart and yearEnd are required and must be numbers');
    }

    return this.reportService.getWFPercentageByCategory({
      yearStart: ys,
      yearEnd: ye,
      departmentIds: depIds.length ? depIds : undefined,
      programIds: progIds.length ? progIds : undefined,
    });
  }

  @Get('wf-category-boxplot')
  async getWFCategoryBoxplot(
    @Query('yearStart') yearStart: string,
    @Query('yearEnd') yearEnd: string,
    @Query('departmentId') departmentId?: string,
    @Query('departmentIds') departmentIds?: string,
    @Query('programId') programId?: string,
    @Query('programIds') programIds?: string,
  ) {
    const ys = parseInt(yearStart, 10);
    const ye = parseInt(yearEnd, 10);
    const parseIds = (val?: string) =>
      val ? val.split(',').map((v) => parseInt(v.trim(), 10)).filter((n) => Number.isFinite(n)) : [];
    const depIds = departmentIds?.length ? parseIds(departmentIds) : (departmentId ? parseIds(departmentId) : []);
    const progIds = programIds?.length ? parseIds(programIds) : (programId ? parseIds(programId) : []);
    return this.reportService.getWFBoxplotByCategory({
      yearStart: ys,
      yearEnd: ye,
      departmentIds: depIds.length ? depIds : undefined,
      programIds: progIds.length ? progIds : undefined,
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

  @Get('avg-gpa-category')
  async getAvgGpaCategory(
    @Query('yearStart') yearStart: string,
    @Query('yearEnd') yearEnd: string,
    @Query('departmentId') departmentId?: string,
    @Query('departmentIds') departmentIds?: string,
    @Query('programId') programId?: string,
    @Query('programIds') programIds?: string,
  ) {
    const ys = parseInt(yearStart, 10);
    const ye = parseInt(yearEnd, 10);
    const parseIds = (val?: string) =>
      val ? val.split(',').map((v) => parseInt(v.trim(), 10)).filter((n) => Number.isFinite(n)) : [];
    const depIds = departmentIds?.length ? parseIds(departmentIds) : (departmentId ? parseIds(departmentId) : []);
    const progIds = programIds?.length ? parseIds(programIds) : (programId ? parseIds(programId) : []);
    if (!Number.isFinite(ys) || !Number.isFinite(ye)) {
      throw new Error('yearStart and yearEnd are required and must be numbers');
    }
    return this.reportService.getAvgGpaByCategory({
      yearStart: ys,
      yearEnd: ye,
      departmentIds: depIds.length ? depIds : undefined,
      programIds: progIds.length ? progIds : undefined,
    });
  }

  @Get('gpa-category-boxplot')
  async getGpaCategoryBoxplot(
    @Query('yearStart') yearStart: string,
    @Query('yearEnd') yearEnd: string,
    @Query('departmentId') departmentId?: string,
    @Query('departmentIds') departmentIds?: string,
    @Query('programId') programId?: string,
    @Query('programIds') programIds?: string,
  ) {
    const ys = parseInt(yearStart, 10);
    const ye = parseInt(yearEnd, 10);
    const parseIds = (val?: string) =>
      val ? val.split(',').map((v) => parseInt(v.trim(), 10)).filter((n) => Number.isFinite(n)) : [];
    const depIds = departmentIds?.length ? parseIds(departmentIds) : (departmentId ? parseIds(departmentId) : []);
    const progIds = programIds?.length ? parseIds(programIds) : (programId ? parseIds(programId) : []);
    return this.reportService.getGpaBoxplotByCategory({
      yearStart: ys,
      yearEnd: ye,
      departmentIds: depIds.length ? depIds : undefined,
      programIds: progIds.length ? progIds : undefined,
    });
  }

  @Get('subject-gpa-table')
  async getSubjectGpaTable(
    @Query('yearStart') yearStart: string,
    @Query('yearEnd') yearEnd: string,
    @Query('departmentId') departmentId?: string,
    @Query('departmentIds') departmentIds?: string,
    @Query('programId') programId?: string,
    @Query('programIds') programIds?: string,
  ) {
    const ys = parseInt(yearStart, 10);
    const ye = parseInt(yearEnd, 10);
    const parseIds = (val?: string) =>
      val ? val.split(',').map((v) => parseInt(v.trim(), 10)).filter((n) => Number.isFinite(n)) : [];
    const depIds = departmentIds?.length ? parseIds(departmentIds) : (departmentId ? parseIds(departmentId) : []);
    const progIds = programIds?.length ? parseIds(programIds) : (programId ? parseIds(programId) : []);
    return this.reportService.getSubjectGpaTable({
      yearStart: ys,
      yearEnd: ye,
      departmentIds: depIds.length ? depIds : undefined,
      programIds: progIds.length ? progIds : undefined,
    });
  }

  @Get('heatmap-category-teaching')
  async getCategoryTeachingHeatmap(
    @Query('yearStart') yearStart: string,
    @Query('yearEnd') yearEnd: string,
    @Query('departmentId') departmentId?: string,
    @Query('departmentIds') departmentIds?: string,
    @Query('programId') programId?: string,
    @Query('programIds') programIds?: string,
  ) {
    const ys = parseInt(yearStart, 10);
    const ye = parseInt(yearEnd, 10);
    const parseIds = (val?: string) =>
      val ? val.split(',').map((v) => parseInt(v.trim(), 10)).filter((n) => Number.isFinite(n)) : [];
    const depIds = departmentIds?.length ? parseIds(departmentIds) : (departmentId ? parseIds(departmentId) : []);
    const progIds = programIds?.length ? parseIds(programIds) : (programId ? parseIds(programId) : []);
    return this.reportService.getCategoryTeachingModeHeatmap({
      yearStart: ys,
      yearEnd: ye,
      departmentIds: depIds.length ? depIds : undefined,
      programIds: progIds.length ? progIds : undefined,
    });
  }
}


