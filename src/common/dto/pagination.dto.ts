import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  public page: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  public limit: number = 10;
}
