import { Module } from '@nestjs/common';
import { CoverageProviderService } from './coverage-provider.service';
import { CoverageProviderController } from './coverage-provider.controller';

@Module({
  providers: [CoverageProviderService],
  controllers: [CoverageProviderController],
})
export class CoverageProviderModule {}
