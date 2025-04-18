import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProdutoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  descricao: string;

  @IsOptional()
  @IsNumber()
  custo?: number;

  @IsOptional()
  imagem?: Buffer;
}

export class UpdateProdutoDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  descricao?: string;

  @IsOptional()
  @IsNumber()
  custo?: number;

  @IsOptional()
  imagem?: Buffer;
}

export class FilterProdutoDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  descricao?: string;

  @IsOptional()
  custo?: number;

  @IsOptional()
  precoVenda?: number;
}

export class CreatePrecoDto {
  @IsNotEmpty()
  @IsNumber()
  lojaId: number;

  @IsNotEmpty()
  @IsNumber()
  precoVenda: number;
}