import { Controller, HttpStatus, HttpCode, UsePipes } from "@nestjs/common";
import { Body, Delete, Get, Post, Put } from "@nestjs/common/decorators";
import { ApiStatus } from "src/_utils/constants";
import { ObjectId } from "src/_utils/decorator/object-id.decorator";
import { ValidationPipe } from "src/_utils/pipes/ValidationPipe";
import { ApiResponse } from "src/_utils/types/ApiResponse";
import { CreateItinenaryDto, createItinenarySchema } from "./dto/CreateItinenaryDto";
import { ItinenaryService } from "./itinenary.service";

@Controller("api/itinenary")
export class ItinenaryController {
  constructor(private readonly itinenaryService: ItinenaryService) {}

  @Get(":event_id")
  async getEventItinenary(@ObjectId("event_id") event_id: string): Promise<ApiResponse> {
    const itinenaries = await this.itinenaryService.getEventItinenary(event_id);
    return {
      data: itinenaries,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Post(":event_id")
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe(createItinenarySchema))
  async createItinenary(
    @ObjectId("event_id") event_id: string,
    @Body() body: CreateItinenaryDto,
  ): Promise<ApiResponse> {
    const itinenary = await this.itinenaryService.createItinenary(event_id, body);

    return {
      data: itinenary,
      code: HttpStatus.CREATED,
      message: ApiStatus.CREATE_SUCCESS,
    };
  }

  @Put(":id")
  @UsePipes(new ValidationPipe(createItinenarySchema))
  async updateItinenary(@ObjectId("id") id: string, @Body() body: CreateItinenaryDto): Promise<ApiResponse> {
    const itinenary = await this.itinenaryService.updateItinenary(id, body);

    return {
      data: itinenary,
      code: HttpStatus.OK,
      message: ApiStatus.UPDATE_SUCCESS,
    };
  }

  @Delete(":id")
  async deleteItinenary(@ObjectId("id") id: string): Promise<ApiResponse> {
    const itinenary = await this.itinenaryService.deleteItinenary(id);

    return {
      data: itinenary,
      code: HttpStatus.OK,
      message: ApiStatus.DELETE_SUCCESS,
    };
  }

  @Post(":event_id/activity")
  async createActivity(@ObjectId("id") id: string): Promise<ApiResponse> {
    const itinenary = await this.itinenaryService.deleteItinenary(id);

    return {
      data: itinenary,
      code: HttpStatus.OK,
      message: ApiStatus.DELETE_SUCCESS,
    };
  }

  @Delete(":id/activity/:activity_id")
  async deleteActivity(@ObjectId("id") id: string, @ObjectId("activity_id") activity_id: string): Promise<ApiResponse> {
    const itinenary = await this.itinenaryService.deleteActivity(id, activity_id);

    return {
      data: itinenary,
      code: HttpStatus.OK,
      message: ApiStatus.DELETE_SUCCESS,
    };
  }
}
