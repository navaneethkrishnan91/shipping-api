import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Parcel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  sku: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column()
  town: string;

  @Column()
  country: string;

  @Column()
  deliveryDate: Date;
}
