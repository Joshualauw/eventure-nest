import * as Joi from "joi";

export interface CreateBudgetDto {
  title: string;
  max_expense: number;
}

export const createBudgetSchema = Joi.object<CreateBudgetDto>({
  title: Joi.string().required(),
  max_expense: Joi.number().required().greater(0).label("max expense"),
});
