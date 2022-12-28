import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata, Inject } from "@nestjs/common";
import { Model } from "../constants";
import { PrismaService } from "../service/prisma.service";

@Injectable()
export class IsExistPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService, @Inject("model") private readonly model: Model) {}

  async transform(value: any, metadata: ArgumentMetadata): Promise<boolean> {
    //if id, use default model. If for example: event_id, use event model
    const modelId = metadata.data.split("_")[0];
    const model = modelId == "id" ? this.model : modelId;
    const exist = await this.prisma[model].findFirst({
      where: { id: value },
    });
    if (!exist) throw new BadRequestException(`${value} not exist in database, ref: ${model}`);

    return value;
  }
}
