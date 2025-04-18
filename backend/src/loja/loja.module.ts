import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LojaController } from './loja.controller';
import { LojaService } from './loja.service';
import { Loja } from './loja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loja])],
  controllers: [LojaController],
  providers: [LojaService],
  exports: [LojaService],
})
export class LojaModule {}