import {UpdateExpenseRequest} from "../requests/UpdateExpenseRequest";
import {ExpenseUpdate} from "../models/ExpenseUpdate";
import * as ddb from "../data/expense";
import {createLogger} from "../utils/logger";

const logger = createLogger("updateExpenseItemService");

export default async function updateExpenseItemService(userId: string, expenseId: string, expenseBus: UpdateExpenseRequest)
  : Promise<ExpenseUpdate> {
  logger.debug("start updateExpenseItemService - ");
  const updItem: ExpenseUpdate = await ddb.updateExpense(userId, expenseId, expenseBus);
  logger.debug("end updateExpenseItemService - out");
  return updItem;
}
