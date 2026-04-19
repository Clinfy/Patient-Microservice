import { Test, TestingModule } from '@nestjs/testing';
import { ProviderPlanService } from './provider-plan.service';

describe('ProviderPlanService', () => {
  let service: ProviderPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderPlanService],
    }).compile();

    service = module.get<ProviderPlanService>(ProviderPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
