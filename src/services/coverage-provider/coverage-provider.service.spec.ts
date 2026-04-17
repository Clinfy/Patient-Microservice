import { Test, TestingModule } from '@nestjs/testing';
import { CoverageProviderService } from './coverage-provider.service';

describe('CoverageProviderService', () => {
  let service: CoverageProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoverageProviderService],
    }).compile();

    service = module.get<CoverageProviderService>(CoverageProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
