import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CoverageProvider } from 'generated/prisma/client';
import { CoverageProviderService } from 'src/services/coverage-provider/coverage-provider.service';
import { CreateCoverageProviderDto } from 'src/interfaces/dto/coverage-provider.dto';
import { PaginatedResponseDto, PaginationQueryDto } from 'src/interfaces/dto/pagination.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { EndpointKey } from 'src/common/decorators/endpoint-key.decorator';
import { ICoverageProvider } from 'src/interfaces/coverage-provider.interface';

@Controller('coverage-provider')
export class CoverageProviderController {
  constructor(private readonly coverageProviderService: CoverageProviderService) {}

  @UseGuards(AuthGuard)
  @EndpointKey('coverage_provider.create')
  @Post('new')
  create(@Body() dto: CreateCoverageProviderDto): Promise<CoverageProvider> {
    return this.coverageProviderService.create(dto);
  }

  @UseGuards(AuthGuard)
  @EndpointKey('coverage_provider.update')
  @Patch('update/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateCoverageProviderDto): Promise<CoverageProvider> {
    return this.coverageProviderService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @EndpointKey('coverage_provider.delete')
  @Delete('delete/:id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.coverageProviderService.delete(id);
  }

  @UseGuards(AuthGuard)
  @EndpointKey('coverage_provider.update')
  @Patch('deactivate/:id')
  deactivateCoverage(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.coverageProviderService.deactivateCoverage(id);
  }

  @UseGuards(AuthGuard)
  @EndpointKey('coverage_provider.update')
  @Patch('activate/:id')
  activateCoverage(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.coverageProviderService.activateCoverage(id);
  }

  @UseGuards(AuthGuard)
  @EndpointKey('coverage_provider.details')
  @Get('details')
  findAllForDetails(): Promise<ICoverageProvider[]> {
    return this.coverageProviderService.findAllForDetails();
  }

  @UseGuards(AuthGuard)
  @EndpointKey('coverage_provider.find')
  @Get('find/:id')
  findOneById(@Param('id', ParseUUIDPipe) id: string): Promise<CoverageProvider> {
    return this.coverageProviderService.findOneById(id);
  }

  @UseGuards(AuthGuard)
  @EndpointKey('coverage_provider.find')
  @Get('all')
  findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<CoverageProvider>> {
    return this.coverageProviderService.findAll(query);
  }
}
