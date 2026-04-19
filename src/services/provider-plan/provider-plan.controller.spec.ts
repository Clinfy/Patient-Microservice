import { Test, TestingModule } from '@nestjs/testing';
import { ProviderPlanController } from './provider-plan.controller';

describe('ProviderPlanController', () => {
  let controller: ProviderPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderPlanController],
    }).compile();

    controller = module.get<ProviderPlanController>(ProviderPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
