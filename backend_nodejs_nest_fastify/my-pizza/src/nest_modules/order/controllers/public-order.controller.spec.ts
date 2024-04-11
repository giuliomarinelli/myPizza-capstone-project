import { Test, TestingModule } from '@nestjs/testing';
import { PublicOrderController } from './public-order.controller';

describe('PublicOrderController', () => {
  let controller: PublicOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicOrderController],
    }).compile();

    controller = module.get<PublicOrderController>(PublicOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
