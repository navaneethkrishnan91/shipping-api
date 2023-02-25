import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Parcel } from '../src/parcels/parcel.entity';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('ParcelsController (e2e)', () => {
  let app: INestApplication;
  let createdParcel: Parcel;
  let parcelRepository: Repository<Parcel>;

  beforeAll(async () => {
    // Create a test database and establish a connection to it
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'db_test',
          port: 3306,
          username: 'root',
          password: 'password',
          database: 'shipping_test',
          entities: [Parcel],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    parcelRepository = moduleFixture.get('ParcelRepository');
  });

  afterAll(async () => {
    // Remove any test data from the database
    await parcelRepository.query('TRUNCATE TABLE parcel');
    await app.close();
  });

  describe('POST /parcels', () => {
    it('should create a new parcel', async () => {
      const parcel = {
        sku: 'ABC123',
        description: 'Test Parcel',
        address: '123 Main St',
        town: 'Tallinn',
        country: 'Estonia',
        deliveryDate: new Date(),
      };

      const response = await request(app.getHttpServer())
        .post('/parcels')
        .send(parcel)
        .expect(201);

      createdParcel = response.body;

      expect(createdParcel.sku).toEqual(parcel.sku);
      expect(createdParcel.description).toEqual(parcel.description);
      expect(createdParcel.address).toEqual(parcel.address);
      expect(createdParcel.town).toEqual(parcel.town);
      expect(createdParcel.country).toEqual(parcel.country);
      expect(new Date(createdParcel.deliveryDate).toISOString).toEqual(
        new Date(parcel.deliveryDate).toISOString,
      );
    });
  });

  describe('GET /parcels', () => {
    it('should find the created parcel in the results', async () => {
      const response = await request(app.getHttpServer())
        .get('/parcels')
        .query({ description: 'Test Parcel' })
        .expect(200);

      const parcels = response.body;

      expect(parcels.length).toBeGreaterThan(0);

      const foundParcel = parcels.find((p) => p.sku === createdParcel.sku);

      expect(foundParcel).toBeDefined();
      expect(foundParcel.description).toEqual(createdParcel.description);
      expect(foundParcel.address).toEqual(createdParcel.address);
      expect(foundParcel.town).toEqual(createdParcel.town);
      expect(foundParcel.country).toEqual(createdParcel.country);
      expect(new Date(foundParcel.deliveryDate).toISOString).toEqual(
        new Date(createdParcel.deliveryDate).toISOString,
      );
    });
  });
});
