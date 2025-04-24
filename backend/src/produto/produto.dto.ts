import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrecoDto)
  precos: CreatePrecoDto[];
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
  @IsNumber()
  lojaId: number;

  @IsNumber()
  @Min(0)
  precoVenda: number;
}