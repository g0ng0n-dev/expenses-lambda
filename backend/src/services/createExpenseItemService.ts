import { CreateExpenseRequest } from '../requests/CreateExpenseRequest'
import * as uuid from 'uuid'
import { createLogger } from '../utils/logger'
import { ExpenseItem } from '../models/ExpenseItem'
import * as ddb from '../data/expense'

const logger = createLogger("createExpenseItemService");

export default async function createExpenseItemService(userId: string, expenseBus: CreateExpenseRequest): Promise<ExpenseItem> {
  logger.debug("createExpenseItemService - in");

  const expenseId = uuid.v4();
  const expenseDb: ExpenseItem = {
    expenseId: expenseId,
    userId: userId,
    createdAt: new Date().toISOString(),
    merchantName: expenseBus.merchantName,
    amount: expenseBus.amount,
    date: expenseBus.date,
    ...expenseBus
  }

  const item: ExpenseItem = await ddb.createExpense(expenseDb);
  logger.debug("createExpenseItemService - out");
  return item;
}
