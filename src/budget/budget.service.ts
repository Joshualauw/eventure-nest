import { Injectable } from "@nestjs/common";
import { InternalServerErrorException } from "@nestjs/common/exceptions";
import { Budget } from "@prisma/client";
import { ApiStatus } from "src/_utils/constants";
import { PrismaService } from "src/_utils/service/prisma.service";
import { CreateBudgetDto } from "./dto/CreateBudgetDto";

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  async getEventBudget(event_id: string): Promise<Budget[]> {
    try {
      const budgets = await this.prisma.budget.findMany({ where: { event_id } });
      return budgets;
    } catch (e: any) {
      throw new InternalServerErrorException(ApiStatus.GET_FAILED);
    }
  }

  async createBudget(event_id: string, payload: CreateBudgetDto): Promise<Budget> {
    try {
      const budget = await this.prisma.budget.create({ data: { event_id, ...payload } });
      return budget;
    } catch (e: any) {
      throw new InternalServerErrorException(ApiStatus.CREATE_FAILED);
    }
  }

  async updateBudget(id: string, payload: CreateBudgetDto): Promise<Budget> {
    try {
      const budget = await this.prisma.budget.update({ where: { id }, data: payload });
      return budget;
    } catch (e: any) {
      throw new InternalServerErrorException(ApiStatus.UPDATE_FAILED);
    }
  }

  async deleteBudget(id: string): Promise<Budget> {
    try {
      const budget = await this.prisma.budget.delete({ where: { id } });
      return budget;
    } catch (e: any) {
      throw new InternalServerErrorException(ApiStatus.DELETE_FAILED);
    }
  }
}
