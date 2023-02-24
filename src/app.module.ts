import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parcel } from './parcels/parcel.entity';
import { ParcelsModule } from './parcels/parcels.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'shipping',
      entities: [Parcel],
      synchronize: true,
    }),
    ParcelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
