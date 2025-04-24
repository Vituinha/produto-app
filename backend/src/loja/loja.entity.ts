import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProdutoLoja } from '../produto/produto-loja.entity';

@Entity()
export class Loja {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60, nullable: false })
  descricao: string;

  @OneToMany(() => ProdutoLoja, produtoLoja => produtoLoja.loja)
  produtos: ProdutoLoja[];
}