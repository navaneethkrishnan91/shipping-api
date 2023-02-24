import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parcel } from './parcel.entity';
import { ParcelsController } from './parcels.controller';
import { ParcelsService } from './parcels.service';

@Module({
  imports: [TypeOrmModule.forFeature([Parcel])],
  controllers: [ParcelsController],
  providers: [ParcelsService],
})
export class ParcelsModule {}
