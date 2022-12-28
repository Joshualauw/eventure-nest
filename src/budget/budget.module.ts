import { Module } from "@nestjs/common";
import { BudgetService } from "./budget.service";
import { BudgetController } from "./budget.controller";
import { PrismaService } from "src/_utils/service/prisma.service";
import { Model } from "src/_utils/constants";

@Module({
  controllers: [BudgetController],
  providers: [
    BudgetService,
    PrismaService,
    {
      provide: Model.provider_token,
      useValue: Model.BUDGET,
    },
  ],
})
export class BudgetModule {}
