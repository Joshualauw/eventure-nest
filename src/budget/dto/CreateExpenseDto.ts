import * as Joi from "joi";

export interface CreateExpenseDto {
  expense_name: string;
  expense_amount: number;
}

export const createExpenseSchema = Joi.object<CreateExpenseDto>({
  expense_name: Joi.string().required().label("expense name"),
  expense_amount: Joi.number().required().greater(0).label("expense amount"),
});
