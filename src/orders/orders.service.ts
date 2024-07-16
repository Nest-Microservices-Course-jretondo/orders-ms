import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOrderDto, OrderPaginationDto, UpdateOrderDto } from './dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('OrdersService has been initialized.');
  }

  async create(createOrderDto: CreateOrderDto) {
    return await this.order
      .create({
        data: createOrderDto,
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new RpcException({
          message: error.message,
          status: HttpStatus.BAD_REQUEST,
        });
      });
  }

  async findAll(paginationDto: OrderPaginationDto) {
    const { limit, page } = paginationDto;

    const total = await this.order.count({
      where: {
        status: paginationDto.status
          ? { equals: paginationDto.status }
          : undefined,
      },
    });
    const data = await this.order.findMany({
      where: {
        status: paginationDto.status
          ? { equals: paginationDto.status }
          : undefined,
      },
      skip: limit * (page - 1),
      take: limit,
    });
    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order
      .findUnique({
        where: { id },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new RpcException({
          message: error.message,
          status: HttpStatus.BAD_REQUEST,
        });
      });
    if (!order) {
      throw new RpcException({
        message: 'Order not found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);
    if (!order) {
      throw new RpcException({
        message: 'Order not found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    return this.order
      .update({
        where: { id },
        data: updateOrderDto,
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new RpcException({
          message: error.message,
          status: HttpStatus.BAD_REQUEST,
        });
      });
  }
}
