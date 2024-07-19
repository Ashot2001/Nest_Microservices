import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CardDto {
  @IsNotEmpty()
  @IsString()
  cvc: string;

  @IsNumber()
  exp_year: number;

  @IsNumber()
  exp_month: number;

  @IsCreditCard()
  number: string;
}
