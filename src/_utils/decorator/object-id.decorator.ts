import { ObjectIdPipe } from "src/_utils/pipes/ObjectIdPipe";
import { Request } from "express";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ObjectId = createParamDecorator((keyId: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as Request;
  const value = request.params[keyId] as string;

  return new ObjectIdPipe().transform(value);
});
