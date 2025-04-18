import { Test, TestingModule } from '@nestjs/testing';
import { LojaController } from './loja.controller';

describe('LojaController', () => {
  let controller: LojaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LojaController],
    }).compile();

    controller = module.get<LojaController>(LojaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
