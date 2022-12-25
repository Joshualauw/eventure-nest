import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Response } from "express";
import { ApiResponse } from "../types/ApiResponse";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse() as any;

    console.log(error);
    response.status(status).json({
      code: status ?? 500,
      message: error.message ?? "server error",
      errors: error.errors ?? [],
    } as ApiResponse);
  }
}
