import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
  
    const precosValidos = (createProdutoDto.precos || []).filter(
      preco => preco.lojaId != null && preco.precoVenda != null
    );
  
    produto.precos = precosValidos.map(preco => {
      const precoEntity = this.produtoLojaRepository.create({
        precoVenda: preco.precoVenda,
        loja: { id: preco.lojaId }
      });
      return precoEntity;
    });
    const produtoSalvo = await this.produtoRepository.save(produto);
  
    if (!produtoSalvo) {
      throw new NotFoundException('Produto não encontrado após criação');
    }
  
    return produtoSalvo;
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto & { precos?: CreatePrecoDto[] }): Promise<Produto> {
    const queryRunner = this.produtoRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!id) {
          throw new BadRequestException('ID do produto é obrigatório');
      }

      const produto = await queryRunner.manager.findOne(Produto, {
          where: { id },
          relations: ['precos', 'precos.loja']
      });

      if (!produto) {
          throw new NotFoundException(`Produto com ID ${id} não encontrado`);
      }

      if (updateProdutoDto.descricao) produto.descricao = updateProdutoDto.descricao;
      if (updateProdutoDto.custo !== undefined) produto.custo = updateProdutoDto.custo;
      if (updateProdutoDto.imagem !== undefined) produto.imagem = updateProdutoDto.imagem;

      if (updateProdutoDto.precos !== undefined) {
          const precosValidos = (updateProdutoDto.precos || []).filter(
              preco => preco?.lojaId && preco?.precoVenda !== undefined
          );

          const lojasAtuais = new Set(precosValidos.map(p => p.lojaId));

          const precosParaRemover = produto.precos.filter(
              preco => preco?.loja?.id && !lojasAtuais.has(preco.loja.id)
          );

          if (precosParaRemover.length > 0) {
              await queryRunner.manager.remove(ProdutoLoja, precosParaRemover);
          }

          for (const precoDto of precosValidos) {
            if (!precoDto?.lojaId) continue;
        
            const precoExistente = produto.precos.find(
                p => p?.loja?.id === precoDto.lojaId
            );
        
            if (precoExistente) {
                precoExistente.precoVenda = precoDto.precoVenda;
                await queryRunner.manager.save(ProdutoLoja, precoExistente);
            } else {
                const novoPreco = queryRunner.manager.create(ProdutoLoja, {
                    precoVenda: precoDto.precoVenda,
                    loja: { id: precoDto.lojaId },
                    produto: produto
                });
                
                const precoSalvo = await queryRunner.manager.save(ProdutoLoja, novoPreco);
                
                produto.precos.push(precoSalvo);
            }
        }
      }

      await queryRunner.manager.save(Produto, produto);
      await queryRunner.commitTransaction();

      const produtoAtualizado = await this.produtoRepository.findOne({
          where: { id },
          relations: ['precos', 'precos.loja']
      });
      if (!produtoAtualizado) {
          throw new NotFoundException('Produto não encontrado após atualização');
      }
      return produtoAtualizado;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        
        if (error instanceof HttpException) {
            throw error;
        }
        
        throw new InternalServerErrorException({
            message: 'Erro ao atualizar produto',
            detail: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const queryRunner = this.produtoRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const produto = await queryRunner.manager.findOne(Produto, {
            where: { id },
            relations: ['precos']
        });

        if (!produto) {
            throw new NotFoundException(`Produto com ID ${id} não encontrado`);
        }

        if (produto.precos && produto.precos.length > 0) {
            await queryRunner.manager.remove(ProdutoLoja, produto.precos);
        }

        await queryRunner.manager.remove(Produto, produto);

        await queryRunner.commitTransaction();
    } catch (error) {
        await queryRunner.rollbackTransaction();
        
        if (error instanceof NotFoundException) {
            throw error;
        }
        
        throw new InternalServerErrorException({
            message: 'Erro ao excluir produto',
            detail: error.message
        });
    } finally {
        await queryRunner.release();
    }
}
}