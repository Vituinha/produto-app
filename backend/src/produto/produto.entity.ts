import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProdutoLoja } from './produto-loja.entity';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60, nullable: false })
  descricao: string;

  @Column('numeric', { precision: 13, scale: 3, nullable: true })
  custo: number;

  @Column({ type: 'bytea', nullable: true })
  imagem: Buffer;

  @OneToMany(() => ProdutoLoja, (produtoLoja) => produtoLoja.produto)
  precos: ProdutoLoja[];
}