import * as Joi from "joi";

export interface CreateEventDto {
  title: string;
  description: string;
  category: string;
  background: string;
  event_images: string[];
  event_location: string;
  venue: string;
  coordinate: [number, number];
  price: number;
  quantity: number;
}

export const createEventSchema = Joi.object<CreateEventDto>({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  background: Joi.string().required(),
  event_images: Joi.array().items(Joi.string()),
  event_location: Joi.string().required().label("event location"),
  venue: Joi.string().required(),
  coordinate: Joi.array().items(Joi.number().precision(10)),
  price: Joi.number().required().greater(-1),
  quantity: Joi.number().required().greater(0),
});
