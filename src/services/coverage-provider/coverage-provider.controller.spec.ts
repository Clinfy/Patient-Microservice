import { Test, TestingModule } from '@nestjs/testing';
import { CoverageProviderController } from './coverage-provider.controller';

describe('CoverageProviderController', () => {
  let controller: CoverageProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoverageProviderController],
    }).compile();

    controller = module.get<CoverageProviderController>(CoverageProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
