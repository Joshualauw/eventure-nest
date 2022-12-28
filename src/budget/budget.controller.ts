import { Controller, HttpStatus, HttpCode, UsePipes } from "@nestjs/common";
import { Get, Post, Body, Put, Delete } from "@nestjs/common/decorators";
import { ApiStatus } from "src/_utils/constants";
import { ObjectId } from "src/_utils/decorator/object-id.decorator";
import { ValidationPipe } from "src/_utils/pipes/ValidationPipe";
import { ApiResponse } from "src/_utils/types/ApiResponse";
import { BudgetService } from "./budget.service";
import { CreateBudgetDto, createBudgetSchema } from "./dto/CreateBudgetDto";

@Controller("api/budget")
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get(":event_id")
  async getEventBudget(@ObjectId("event_id") event_id: string): Promise<ApiResponse> {
    const budgets = await this.budgetService.getEventBudget(event_id);
    return {
      data: budgets,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Post(":event_id")
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe(createBudgetSchema))
  async createBudget(@ObjectId("event_id") event_id: string, @Body() body: CreateBudgetDto): Promise<ApiResponse> {
    const budget = await this.budgetService.createBudget(event_id, body);
    return {
      data: budget,
      code: HttpStatus.CREATED,
      message: ApiStatus.CREATE_SUCCESS,
    };
  }

  @Put(":id")
  @UsePipes(new ValidationPipe(createBudgetSchema))
  async updateItinenary(@ObjectId("id") id: string, @Body() body: CreateBudgetDto): Promise<ApiResponse> {
    const budget = await this.budgetService.updateBudget(id, body);
    return {
      data: budget,
      code: HttpStatus.OK,
      message: ApiStatus.UPDATE_SUCCESS,
    };
  }

  @Delete(":id")
  async deleteBudget(@ObjectId("id") id: string): Promise<ApiResponse> {
    const budget = await this.budgetService.deleteBudget(id);
    return {
      data: budget,
      code: HttpStatus.OK,
      message: ApiStatus.DELETE_SUCCESS,
    };
  }
}
