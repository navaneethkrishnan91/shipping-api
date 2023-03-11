import { Test, TestingModule } from '@nestjs/testing';
import { ParcelsController } from './parcels.controller';
import { ParcelsService } from './parcels.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Parcel } from './parcel.entity';

describe('ParcelsController', () => {
  let controller: ParcelsController;
  let service: ParcelsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const parcels: Parcel[] = [
    {
      id: 1,
      sku: '12345',
      description: 'Test parcel1',
      address: '123 Main St',
      town: 'Anytown',
      country: 'USA',
      deliveryDate: new Date(),
    },
    {
      id: 2,
      sku: '23456',
      description: 'Test parcel2',
      address: '246 Long St',
      town: 'Sometown',
      country: 'Estonia',
      deliveryDate: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParcelsController],
      providers: [
        ParcelsService,
        { provide: getRepositoryToken(Parcel), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<ParcelsController>(ParcelsController);
    service = module.get<ParcelsService>(ParcelsService);

    jest
      .spyOn(service, 'findAll')
      .mockImplementation((country, description) => {
        return Promise.resolve(
          parcels.filter((parcel) => {
            return (
              (country ? parcel.country === country : true) &&
              (description ? parcel.description === description : true)
            );
          }),
        );
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of parcels', async () => {
      expect(await controller.findAll(null, null)).toStrictEqual(parcels);
    });

    it('should filter by country', async () => {
      expect(await controller.findAll('USA', null)).toStrictEqual([parcels[0]]);
    });

    it('should filter by description', async () => {
      expect(await controller.findAll(null, 'Test parcel2')).toStrictEqual([
        parcels[1],
      ]);
    });
  });

  describe('create', () => {
    it('should create a parcel', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(parcels[0]);

      expect(await controller.create(parcels[0])).toBe(parcels[0]);
    });
  });

  describe('checkSkuExists', () => {
    it('should return exists=true if the SKU exists', async () => {
      const sku = parcels[0].sku;
      jest.spyOn(service, 'checkSkuExists').mockImplementation((sku) => {
        return Promise.resolve(parcels.some((parcel) => parcel.sku == sku));
      });

      expect(await controller.checkSkuExists(sku)).toEqual({ exists: true });
    });
  });
});
