import { Controller, HttpStatus, UsePipes, HttpCode } from "@nestjs/common";
import { Put, Body, Req, Post, Query, Get, Patch } from "@nestjs/common/decorators";
import { ApiStatus } from "src/_utils/constants";
import { ObjectId } from "src/_utils/decorator/object-id.decorator";
import { UserReq } from "src/_utils/decorator/user.decorator";
import { ValidationPipe } from "src/_utils/pipes/ValidationPipe";
import { ApiResponse } from "src/_utils/types/ApiResponse";
import { CreateEventDto, createEventSchema } from "./dto/CreateEventDto";
import { EventService } from "./event.service";
import { HomeQueryPipe } from "./pipes/HomeQueryPipe";

@Controller("api/event")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get("home")
  async getHomeEvents(@Query(HomeQueryPipe) query: any): Promise<ApiResponse> {
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

  @Get("wishlist")
  async getWishlistEvents(@UserReq("id") user_id: string): Promise<ApiResponse> {
    const events = await this.eventService.getWishlistEvents(user_id);

    return {
      data: events,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe(createEventSchema))
  async createEvent(@UserReq("id") user_id: string, @Body() body: CreateEventDto): Promise<ApiResponse> {
    const event = await this.eventService.createEvent(body, user_id);

    return {
      data: event,
      code: HttpStatus.CREATED,
      message: ApiStatus.CREATE_SUCCESS,
    };
  }

  @Put()
  @UsePipes(new ValidationPipe(createEventSchema))
  async updateEvent(@UserReq("id") user_id: string, @Body() body: CreateEventDto): Promise<ApiResponse> {
    const event = await this.eventService.createEvent(body, user_id);

    return {
      data: event,
      code: HttpStatus.OK,
      message: ApiStatus.UPDATE_SUCCESS,
    };
  }

  @Put(":id/open")
  async openEvent(@ObjectId("id") id: string): Promise<ApiResponse> {
    await this.eventService.openEvent(id);

    return {
      code: HttpStatus.OK,
      message: "opened successfuly",
    };
  }

  @Put(":id/close")
  @UsePipes(new ValidationPipe(createEventSchema))
  async closeEvent(@UserReq("id") user_id: string, @Body() body: CreateEventDto): Promise<ApiResponse> {
    const event = await this.eventService.createEvent(body, user_id);

    return {
      data: event,
      code: HttpStatus.OK,
      message: ApiStatus.UPDATE_SUCCESS,
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
  async getOneEvent(@ObjectId("id") id: string): Promise<ApiResponse> {
    const event = await this.eventService.getOneEvent(id);

    return {
      data: event,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Patch(":id/wishlist")
  async setWishlist(@ObjectId("id") id: string, @UserReq("id") user_id: string): Promise<ApiResponse> {
    const { message, data: wishlist } = await this.eventService.setWishlist(id, user_id);

    return {
      data: wishlist,
      code: HttpStatus.OK,
      message: `event ${message} to wishlist`,
    };
  }
}
