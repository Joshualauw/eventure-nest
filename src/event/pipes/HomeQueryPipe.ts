import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class HomeQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    let query = value;
    Object.assign(query, { status: true });
    if (query.category) Object.assign(query, { category: query.category });
    if (query.title) Object.assign(query, { title: { contains: query.title } });
    if (query.minPrice && query.maxPrice) {
      Object.assign(query, {
        AND: [
          { price: { gte: parseInt(query.minPrice.toString()) } },
          { price: { lte: parseInt(query.maxPrice.toString()) } },
        ],
      });
    }
    return query;
  }
}
