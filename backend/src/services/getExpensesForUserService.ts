import {ExpenseItem} from "../models/ExpenseItem";
import * as ddb from "../data/expense";
import {createLogger} from "../utils/logger";

const logger = createLogger("getExpensesForUserService");


export default async function getExpensesForUserService(userId: string): Promise<ExpenseItem[]> {
  logger.debug("start getExpensesForUserService");
  const items: ExpenseItem[] = await ddb.getExpenseByUser(userId);
  logger.debug("end getExpensesForUserService");
  return items;
}
