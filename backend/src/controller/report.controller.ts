import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from '../service/report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // GET /report/wf-category?yearStart=2560&yearEnd=2573&departmentId=...&coursePlanId=...
  @Get('wf-category')
  async getWFCategory(
    @Query('yearStart') yearStart: string,
    @Query('yearEnd') yearEnd: string,
    @Query('departmentId') departmentId?: string,
    @Query('departmentIds') departmentIds?: string,
    @Query('coursePlanId') coursePlanId?: string,
    @Query('coursePlanIds') coursePlanIds?: string,
  ) {
    const ys = parseInt(yearStart, 10);
    const ye = parseInt(yearEnd, 10);
    const parseIds = (val?: string) =>
      val ? val.split(',').map((v) => parseInt(v.trim(), 10)).filter((n) => Number.isFinite(n)) : [];
    const depIds = departmentIds?.length ? parseIds(departmentIds) : (departmentId ? parseIds(departmentId) : []);
    const cpIds = coursePlanIds?.length ? parseIds(coursePlanIds) : (coursePlanId ? parseIds(coursePlanId) : []);

    if (!Number.isFinite(ys) || !Number.isFinite(ye)) {
      throw new Error('yearStart and yearEnd are required and must be numbers');
    }

    return this.reportService.getWFPercentageByCategory({
      yearStart: ys,
      yearEnd: ye,
      departmentIds: depIds.length ? depIds : undefined,
      departmentId: depIds.length === 0 && departmentId ? parseInt(departmentId, 10) : undefined,
      coursePlanIds: cpIds.length ? cpIds : undefined,
      coursePlanId: cpIds.length === 0 && coursePlanId ? parseInt(coursePlanId, 10) : undefined,
    });
  }

  @Get('wf-category-boxplot')
  async getWFCategoryBoxplot(
    @Query('yearStart') yearStart: string,
    @Query('yearEnd') yearEnd: string,
    @Query('departmentId') departmentId?: string,
    @Query('departmentIds') departmentIds?: string,
    @Query('coursePlanId') coursePlanId?: string,
    @Query('coursePlanIds') coursePlanIds?: string,
  ) {
    const ys = parseInt(yearStart, 10);
    const ye = parseInt(yearEnd, 10);
    const parseIds = (val?: string) =>
      val ? val.split(',').map((v) => parseInt(v.trim(), 10)).filter((n) => Number.isFinite(n)) : [];
    const depIds = departmentIds?.length ? parseIds(departmentIds) : (departmentId ? parseIds(departmentId) : []);
    const cpIds = coursePlanIds?.length ? parseIds(coursePlanIds) : (coursePlanId ? parseIds(coursePlanId) : []);
    return this.reportService.getWFBoxplotByCategory({
      yearStart: ys,
      yearEnd: ye,
      departmentIds: depIds.length ? depIds : undefined,
      departmentId: depIds.length === 0 && departmentId ? parseInt(departmentId, 10) : undefined,
      coursePlanIds: cpIds.length ? cpIds : undefined,
      coursePlanId: cpIds.length === 0 && coursePlanId ? parseInt(coursePlanId, 10) : undefined,
    });
  }

  @Get('wf-heatmap-year-category')
  async getWFHeatmapYearCategory(
    @Query('yearStart') yearStart: string,
    @Query('yearEnd') yearEnd: string,
    @Query('departmentId') departmentId?: string,
    @Query('departmentIds') departmentIds?: string,
    @Query('coursePlanId') coursePlanId?: string,
    @Query('coursePlanIds') coursePlanIds?: string,
  ) {
    const ys = parseInt(yearStart, 10);
    const ye = parseInt(yearEnd, 10);
    const parseIds = (val?: string) =>
      val ? val.split(',').map((v) => parseInt(v.trim(), 10)).filter((n) => Number.isFinite(n)) : [];
    const depIds = departmentIds?.length ? parseIds(departmentIds) : (departmentId ? parseIds(departmentId) : []);
    const cpIds = coursePlanIds?.length ? parseIds(coursePlanIds) : (coursePlanId ? parseIds(coursePlanId) : []);
    if (!Number.isFinite(ys) || !Number.isFinite(ye)) {
      throw new Error('yearStart and yearEnd are required and must be numbers');
    }
    return this.reportService.getWFHeatmapByYearCategory({
      yearStart: ys,
      yearEnd: ye,
      departmentIds: depIds.length ? depIds : undefined,
      departmentId: depIds.length === 0 && departmentId ? parseInt(departmentId, 10) : undefined,
      coursePlanIds: cpIds.length ? cpIds : undefined,
      coursePlanId: cpIds.length === 0 && coursePlanId ? parseInt(coursePlanId, 10) : undefined,
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

  @Get('course-plans')
  async getCoursePlans() {
    return this.reportService.listCoursePlans();
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

  @Get('wf-subject-table')
  async getWFSubjectTable(
    @Query('yearStart') yearStart: string,
    @Query('yearEnd') yearEnd: string,
    @Query('departmentId') departmentId?: string,
    @Query('departmentIds') departmentIds?: string,
    @Query('coursePlanId') coursePlanId?: string,
    @Query('coursePlanIds') coursePlanIds?: string,
  ) {
    const ys = parseInt(yearStart, 10);
    const ye = parseInt(yearEnd, 10);
    const parseIds = (val?: string) =>
      val ? val.split(',').map((v) => parseInt(v.trim(), 10)).filter((n) => Number.isFinite(n)) : [];
    const depIds = departmentIds?.length ? parseIds(departmentIds) : (departmentId ? parseIds(departmentId) : []);
    const cpIds = coursePlanIds?.length ? parseIds(coursePlanIds) : (coursePlanId ? parseIds(coursePlanId) : []);
    if (!Number.isFinite(ys) || !Number.isFinite(ye)) {
      throw new Error('yearStart and yearEnd are required and must be numbers');
    }
    return this.reportService.getWFSubjectTable({
      yearStart: ys,
      yearEnd: ye,
      departmentIds: depIds.length ? depIds : undefined,
      departmentId: depIds.length === 0 && departmentId ? parseInt(departmentId, 10) : undefined,
      coursePlanIds: cpIds.length ? cpIds : undefined,
      coursePlanId: cpIds.length === 0 && coursePlanId ? parseInt(coursePlanId, 10) : undefined,
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


