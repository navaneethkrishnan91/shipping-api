import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcel } from './parcel.entity';

@Injectable()
export class ParcelsService {
  constructor(
    @InjectRepository(Parcel)
    private readonly parcelsRepository: Repository<Parcel>,
  ) {}

  async findAll(country?: string, description?: string): Promise<Parcel[]> {
    const queryBuilder = this.parcelsRepository.createQueryBuilder('parcel');

    if (country) {
      queryBuilder.andWhere('LOWER(parcel.country) LIKE LOWER(:country)', {
        country: `%${country}%`,
      });
    }

    if (description) {
      queryBuilder.andWhere(
        'LOWER(parcel.description) LIKE LOWER(:description)',
        { description: `%${description}%` },
      );
    }

    const parcels = await queryBuilder
      .addOrderBy(
        `CASE WHEN LOWER(parcel.country) = 'estonia' THEN 0 ELSE 1 END`,
      )
      .addOrderBy('parcel.deliveryDate', 'ASC')
      .getMany();

    return parcels;
  }

  async create(parcel: Parcel): Promise<Parcel> {
    return this.parcelsRepository.save(parcel);
  }

  async checkSkuExists(sku: string): Promise<boolean> {
    const parcel = await this.parcelsRepository.findOneBy({ sku });
    return !!parcel;
  }
}
