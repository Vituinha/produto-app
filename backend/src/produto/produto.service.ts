import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './produto.entity';
import { CreateProdutoDto, UpdateProdutoDto, FilterProdutoDto, CreatePrecoDto } from './produto.dto';
import { ProdutoLoja } from './produto-loja.entity';
import { Loja } from '../loja/loja.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    @InjectRepository(ProdutoLoja)
    private produtoLojaRepository: Repository<ProdutoLoja>,
    @InjectRepository(Loja)
    private lojaRepository: Repository<Loja>,
  ) {}

  async findAll(filter: FilterProdutoDto): Promise<Produto[]> {
    const { id, descricao, custo, precoVenda } = filter;
    
    const query = this.produtoRepository
      .createQueryBuilder('produto')
      .leftJoinAndSelect('produto.precos', 'precos')
      .leftJoinAndSelect('precos.loja', 'loja');

    if (id) {
      query.andWhere('produto.id = :id', { id });
    }

    if (descricao) {
      query.andWhere('produto.descricao LIKE :descricao', { descricao: `%${descricao}%` });
    }

    if (custo) {
      query.andWhere('produto.custo = :custo', { custo });
    }

    if (precoVenda) {
      query.andWhere('precos.precoVenda = :precoVenda', { precoVenda });
    }

    return query.getMany();
  }

  async getLojas(): Promise<Loja[]> {
    return this.lojaRepository.find();
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: ['precos', 'precos.loja'],
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return produto;
  }

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const produto = this.produtoRepository.create(createProdutoDto);
    return this.produtoRepository.save(produto);
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.findOne(id);
    this.produtoRepository.merge(produto, updateProdutoDto);
    return this.produtoRepository.save(produto);
  }

  async remove(id: number): Promise<void> {
    const produto = await this.findOne(id);
    await this.produtoRepository.remove(produto);
  }

  async addPreco(produtoId: number, createPrecoDto: CreatePrecoDto): Promise<ProdutoLoja> {
    const produto = await this.findOne(produtoId);
    const loja = await this.lojaRepository.findOne({ where: { id: createPrecoDto.lojaId } });

    if (!loja) {
      throw new NotFoundException(`Loja com ID ${createPrecoDto.lojaId} não encontrada`);
    }

    const existingPreco = await this.produtoLojaRepository.findOne({
      where: {
        produto: { id: produtoId },
        loja: { id: createPrecoDto.lojaId },
      },
    });

    if (existingPreco) {
      throw new Error('Já existe um preço cadastrado para esta loja');
    }

    const preco = this.produtoLojaRepository.create({
      produto,
      loja,
      precoVenda: createPrecoDto.precoVenda,
    });

    return this.produtoLojaRepository.save(preco);
  }
}