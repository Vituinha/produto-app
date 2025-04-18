import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Produto } from './produto.entity';
import { Loja } from '../loja/loja.entity';

@Entity()
export class ProdutoLoja {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Produto, (produto) => produto.precos)
  produto: Produto;

  @ManyToOne(() => Loja)
  loja: Loja;

  @Column('numeric', { precision: 13, scale: 3, nullable: false })
  precoVenda: number;
}