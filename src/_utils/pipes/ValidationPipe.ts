import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { ObjectSchema } from "joi";
import { ApiStatus } from "../constants";
import { ApiResponse } from "../types/ApiResponse";

function errorBuilder(e: any): string[] {
  return e.details.map((d: any) => d.message);
}

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error, value: validated } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException({
        message: ApiStatus.VALIDATION_FAILED,
        errors: errorBuilder(error),
      } as ApiResponse);
    }
    return validated;
  }
}
