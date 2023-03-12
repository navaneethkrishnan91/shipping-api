import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { Parcel } from './parcel.entity';
import { ParcelsService } from './parcels.service';
import { CreateParcelDto } from './dto/create-parcel.dto';

@Controller('parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Get()
  async findAll(
    @Query('country') country: string,
    @Query('description') description: string,
  ): Promise<Parcel[]> {
    return this.parcelsService.findAll(country, description);
  }

  @Post()
  async create(@Body() parcel: CreateParcelDto): Promise<Parcel> {
    return this.parcelsService.create(parcel);
  }

  @Get('skus/:sku')
  async checkSkuExists(
    @Param('sku') sku: string,
  ): Promise<{ exists: boolean }> {
    const exists = await this.parcelsService.checkSkuExists(sku);
    return { exists };
  }
}
