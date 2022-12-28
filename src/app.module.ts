import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { EventModule } from "./event/event.module";
import { JwtAuthGuard } from "./_utils/guard/jwt.guard";
import { ItinenaryModule } from "./itinenary/itinenary.module";
import { BudgetModule } from "./budget/budget.module";

@Module({
  imports: [UserModule, EventModule, ItinenaryModule, BudgetModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: "APP_GUARD",
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
