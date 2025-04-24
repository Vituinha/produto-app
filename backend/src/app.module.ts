import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoModule } from './produto/produto.module';
import { LojaModule } from './loja/loja.module';
import { Produto } from './produto/produto.entity';
import { ProdutoLoja } from './produto/produto-loja.entity';
import { Loja } from './loja/loja.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '171307',
      database: 'produto_db',
      entities: [
        Produto,
        ProdutoLoja,
        Loja
      ],
      synchronize: true,
      logging: true,
      migrationsRun: true,
      extra: {
        trustServerCertificate: true
      }
    }),
    TypeOrmModule.forFeature([Produto, ProdutoLoja, Loja]),
    ProdutoModule,
    LojaModule,
  ],
})
export class AppModule {}