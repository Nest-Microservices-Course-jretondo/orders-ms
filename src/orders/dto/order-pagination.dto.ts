import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { OrderStatusList } from './enum/order.enum';
import { OrderStatus } from '@prisma/client';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `status must be a valid enum value: ${OrderStatusList}`,
  })
  public status: OrderStatus;
}
