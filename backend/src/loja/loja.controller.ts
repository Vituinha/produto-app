import { Controller, Get } from '@nestjs/common';
import { LojaService } from './loja.service';

@Controller('lojas')
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  @Get()
  findAll() {
    return this.lojaService.findAll();
  }
}