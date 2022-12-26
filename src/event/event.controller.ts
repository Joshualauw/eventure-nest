import { Controller, HttpStatus, UsePipes, HttpCode } from "@nestjs/common";
import { Param, Put, Body, Req, Post, Query, Get, Patch } from "@nestjs/common/decorators";
import { User } from "@prisma/client";
import { ApiStatus } from "src/_utils/constants";
import { UserReq } from "src/_utils/decorator/user.decorator";
import { ObjectIdPipe } from "src/_utils/pipes/ObjectIdPipe";
import { ValidationPipe } from "src/_utils/pipes/ValidationPipe";
import { ApiResponse } from "src/_utils/types/ApiResponse";
import { CreateEventDto, createEventSchema } from "./dto/CreateEventDto";
import { EventService } from "./event.service";

@Controller("api/event")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get("home")
  async getHomeEvents(@Query() query): Promise<ApiResponse> {
    Object.assign(query, { status: true });
    if (query.category) Object.assign(query, { category: query.category });
    if (query.title) Object.assign(query, { title: { contains: query.title } });
    if (query.minPrice && query.maxPrice) {
      Object.assign(query, {
        AND: [
          { price: { gte: parseInt(query.minPrice.toString()) } },
          { price: { lte: parseInt(query.maxPrice.toString()) } },
        ],
      });
    }

    const events = await this.eventService.getHomeEvents(query);
    return {
      data: events,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Get("attended")
  async getAttendedEvents(@UserReq("id") user_id: string): Promise<ApiResponse> {
    const events = await this.eventService.getAttendedEvents(user_id);

    return {
      data: events,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe(createEventSchema))
  async createEvent(@UserReq("id") user_id: string, @Body() createEventDto: CreateEventDto) {
    const event = await this.eventService.createEvent(createEventDto, user_id);

    return {
      data: event,
      code: HttpStatus.CREATED,
      message: ApiStatus.CREATE_SUCCESS,
    };
  }

  @Put()
  @UsePipes(new ValidationPipe(createEventSchema))
  async updateEvent(@UserReq("id") user_id: string, @Body() updateEventDto: CreateEventDto) {
    const event = await this.eventService.createEvent(updateEventDto, user_id);

    return {
      data: event,
      code: HttpStatus.OK,
      message: ApiStatus.UPDATE_SUCCESS,
    };
  }

  @Get()
  async getWishlistEvents(@UserReq("id") user_id: string): Promise<ApiResponse> {
    const events = await this.eventService.getManagedEvents(user_id);

    return {
      data: events,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Get()
  async getManagedEvents(@Req() req: any): Promise<ApiResponse> {
    const events = await this.eventService.getManagedEvents(req.user.id);

    return {
      data: events,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Get(":id")
  async getOneEvent(@Param("id", ObjectIdPipe) id: string): Promise<ApiResponse> {
    const event = await this.eventService.getOneEvent(id);

    return {
      data: event,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Patch(":id/wishlist")
  async setWishlist(@Param("id", ObjectIdPipe) id: string, @UserReq("id") user_id: string): Promise<ApiResponse> {
    const { message, data: wishlist } = await this.eventService.setWishlist(id, user_id);

    return {
      data: wishlist,
      code: HttpStatus.OK,
      message: `event ${message} to wishlist`,
    };
  }
}
