import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ProviderPlan } from 'generated/prisma/client';
import { ProviderPlanService } from 'src/services/provider-plan/provider-plan.service';
import { CreateProviderPlanDto, UpdateProviderPlanDto } from 'src/interfaces/dto/provider-plan.dto';
import { IProviderPlan } from 'src/interfaces/provider-plan.interface';
import { PaginatedResponseDto, PaginationQueryDto } from 'src/interfaces/dto/pagination.dto';

@Controller('provider-plan')
export class ProviderPlanController {
  constructor(private readonly providerPlanService: ProviderPlanService) {}

  @Post('new')
  createProviderPlan(@Body() providerPlanDto: CreateProviderPlanDto): Promise<ProviderPlan> {
    return this.providerPlanService.create(providerPlanDto);
  }

  @Patch('update/:id')
  updateProviderPlan(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProviderPlanDto): Promise<ProviderPlan> {
    return this.providerPlanService.update(id, dto);
  }

  @Patch('activate/:id')
  activatePlan(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.providerPlanService.activatePlan(id);
  }

  @Patch('deactivate/:id')
  deactivatePlan(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.providerPlanService.deactivatePlan(id);
  }

  @Delete('delete/:id')
  deleteProviderPlan(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.providerPlanService.delete(id);
  }

  @Get('details/:providerId')
  findDetailsByProvider(@Param('providerId', ParseUUIDPipe) id: string): Promise<IProviderPlan[]> {
    return this.providerPlanService.findDetailsByProvider(id);
  }

  @Get('all/:providerId')
  findAllByProvider(
    @Param('providerId', ParseUUIDPipe) id: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ProviderPlan>> {
    return this.providerPlanService.findAllByProviderId(id, query);
  }

  @Get('find/:id')
  findOneById(@Param('id', ParseUUIDPipe) id: string): Promise<ProviderPlan> {
    return this.providerPlanService.findOneById(id);
  }
}
