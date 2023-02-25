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

  /**
   * Returns a Promise that resolves to an array of Parcel entities.
   * Optionally accepts two string parameters to filter the results:
   * 
   * @param country a string used to filter the parcels by country. 
   * If provided, only parcels with a country that contains the given string (case-insensitive) will be returned.
   * 
   * @param description a string used to filter the parcels by description. 
   * If provided, only parcels with a description that contains the given string (case-insensitive) will be returned.
   * 
   * The returned parcels are ordered first by their country (with Estonian parcels first), and then by their delivery date.
   */
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

  /**
   * Returns a Promise that resolves to the newly created Parcel entity.
   * 
   * @param parcel a Parcel object that contains the data for the new parcel.
   */
  async create(parcel: Parcel): Promise<Parcel> {
    return this.parcelsRepository.save(parcel);
  }

  /**
   * Returns a Promise that resolves to a boolean value indicating whether
   * a Parcel entity with the given SKU exists in the database.
   * 
   * @param sku SKU value to check for existence.
   */
  async checkSkuExists(sku: string): Promise<boolean> {
    const parcel = await this.parcelsRepository.findOneBy({ sku });
    return !!parcel;
  }
}
