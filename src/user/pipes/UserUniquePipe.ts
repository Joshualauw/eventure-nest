import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { UserService } from "../user.service";
import { CreateUserDto } from "../dto/CreateUserDto";
import { ApiStatus } from "src/_utils/constants";

@Injectable()
export class UserUniquePipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: CreateUserDto) {
    const errors = await this.userService.checkUniqueUser(value);
    if (errors.length > 0) {
      throw new BadRequestException({ message: ApiStatus.VALIDATION_FAILED, errors: errors });
    }
    return value;
  }
}
