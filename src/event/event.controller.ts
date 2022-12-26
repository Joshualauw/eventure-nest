import { Controller, Get, HttpStatus, UseGuards, Query, Req, Post, Body, UsePipes } from "@nestjs/common";
import { Param } from "@nestjs/common/decorators";
import { User } from "@prisma/client";
import { ApiStatus } from "src/_utils/constants";
import { JwtAuthGuard } from "src/_utils/guard/jwt.guard";
import { ObjectIdPipe } from "src/_utils/pipes/ObjectIdPipe";
import { ValidationPipe } from "src/_utils/pipes/ValidationPipe";
import { ApiResponse } from "src/_utils/types/ApiResponse";
import { CreateEventDto, createEventSchema } from "./dto/CreateEventDto";
import { EventService } from "./event.service";

@Controller("api/event")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get("home")
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async getAttendedEvents(@Req() req: { user: Omit<User, "password"> }): Promise<ApiResponse> {
    const events = await this.eventService.getAttendedEvents(req.user.id);

    return {
      data: events,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe(createEventSchema))
  async createEvent(@Req() req: { user: Omit<User, "password"> }, @Body() createEventDto: CreateEventDto) {
    const event = await this.eventService.createEvent(createEventDto, req.user.id);

    return {
      data: event,
      code: HttpStatus.CREATED,
      message: ApiStatus.CREATE_SUCCESS,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getManagedEvents(@Req() req: { user: Omit<User, "password"> }): Promise<ApiResponse> {
    const events = await this.eventService.getManagedEvents(req.user.id);

    return {
      data: events,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getOneEvent(@Param("id", ObjectIdPipe) id: string): Promise<ApiResponse> {
    const event = await this.eventService.getOneEvent(id);

    return {
      data: event,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }
}
