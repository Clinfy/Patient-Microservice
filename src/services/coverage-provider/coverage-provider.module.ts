import { Module } from '@nestjs/common';
import { CoverageProviderService } from './coverage-provider.service';
import { CoverageProviderController } from './coverage-provider.controller';
import { CoverageProviderRepository } from 'src/services/coverage-provider/coverage-provider.repository';

@Module({
  providers: [CoverageProviderService, CoverageProviderRepository],
  controllers: [CoverageProviderController],
  exports: [CoverageProviderService],
})
export class CoverageProviderModule {}
