import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { Produto } from './produto.entity';
import { CreateProdutoDto, UpdateProdutoDto, FilterProdutoDto, CreatePrecoDto } from './produto.dto';

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  findAll(@Query() filter: FilterProdutoDto): Promise<Produto[]> {
    return this.produtoService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Produto> {
    return this.produtoService.findOne(+id);
  }

  @Post()
  create(@Body() createProdutoDto: CreateProdutoDto): Promise<Produto> {
    return this.produtoService.create(createProdutoDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    return this.produtoService.update(+id, updateProdutoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.produtoService.remove(+id);
  }

  @Post(':id/precos')
  addPreco(@Param('id') id: number, @Body() createPrecoDto: CreatePrecoDto) {
    return this.produtoService.addPreco(+id, createPrecoDto);
  }
}