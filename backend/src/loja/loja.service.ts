import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loja } from './loja.entity';

@Injectable()
export class LojaService {
  constructor(
    @InjectRepository(Loja)
    private lojaRepository: Repository<Loja>,
  ) {}

  findAll() {
    return this.lojaRepository.find();
  }
}