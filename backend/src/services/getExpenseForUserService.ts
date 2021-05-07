import {ExpenseItem} from "../models/ExpenseItem";
import * as ddb from "../data/expense";
import {createLogger} from "../utils/logger";

const logger = createLogger("getExpenseItemService");

export default async function getExpenseItemService(userId: string, expenseId: string)
  : Promise<ExpenseItem> {
  logger.debug("start getExpenseItemService");

  const expenseItem: ExpenseItem = await ddb.getExpense(userId, expenseId);
  if (expenseItem) {
    return expenseItem
  }

  logger.debug("end getExpenseItemService");
  return;
}
