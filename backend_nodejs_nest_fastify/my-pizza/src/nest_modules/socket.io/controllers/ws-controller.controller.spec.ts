import { Test, TestingModule } from '@nestjs/testing';
import { WsControllerController } from './ws-controller.controller';

describe('WsControllerController', () => {
  let controller: WsControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WsControllerController],
    }).compile();

    controller = module.get<WsControllerController>(WsControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
