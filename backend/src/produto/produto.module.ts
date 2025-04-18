import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { Produto } from './produto.entity';
import { ProdutoLoja } from './produto-loja.entity';
import { Loja } from '../loja/loja.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Produto, ProdutoLoja, Loja]),
  ],
  controllers: [ProdutoController],
  providers: [ProdutoService],
})
export class ProdutoModule {}