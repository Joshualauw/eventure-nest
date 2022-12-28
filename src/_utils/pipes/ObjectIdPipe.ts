import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
@Injectable()
export class ObjectIdPipe implements PipeTransform {
  constructor() {}

  transform(value: string) {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException(`${value} is not a valid ObjectId`);
    }
    return value;
  }
}
