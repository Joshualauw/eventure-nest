import { Controller, Get, HttpStatus } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiResponse } from "./_utils/types/ApiResponse";

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("healthcheck")
  healthCheck(): ApiResponse {
    const healthCheck = this.appService.healthCheck();

    return {
      data: healthCheck,
      code: HttpStatus.OK,
      message: "success",
    };
  }
}
