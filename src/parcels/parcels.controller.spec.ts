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

  const newParcel: Parcel = {
    id: 1,
    sku: '12345',
    description: 'Test parcel',
    address: '123 Main St',
    town: 'Anytown',
    country: 'USA',
    deliveryDate: new Date(),
  };

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
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of parcels', async () => {
      const result = [newParcel];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(null, null)).toBe(result);
    });

    it('should filter by country', async () => {
      const result = [newParcel];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll('USA', null)).toBe(result);
    });

    it('should filter by description', async () => {
      const result = [newParcel];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(null, 'Test parcel')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a parcel', async () => {
      const parcel = newParcel;
      jest.spyOn(service, 'create').mockResolvedValue(parcel);

      expect(await controller.create(parcel)).toBe(parcel);
    });
  });

  describe('checkSkuExists', () => {
    it('should return exists=true if the SKU exists', async () => {
      const sku = 'ABC123';
      jest.spyOn(service, 'checkSkuExists').mockResolvedValue(true);

      expect(await controller.checkSkuExists(sku)).toEqual({ exists: true });
    });

    it('should return exists=false if the SKU does not exist', async () => {
      const sku = 'ABC123';
      jest.spyOn(service, 'checkSkuExists').mockResolvedValue(false);

      expect(await controller.checkSkuExists(sku)).toEqual({ exists: false });
    });
  });
});
