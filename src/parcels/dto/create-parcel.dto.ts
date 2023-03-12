import { IsNotEmpty } from 'class-validator';

export class CreateParcelDto {
  @IsNotEmpty()
  sku: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  town: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  deliveryDate: Date;
}