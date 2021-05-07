import {ExpenseItem} from "../models/ExpenseItem";
import * as ddb from "../data/expense";
import * as s3Svc from "../data/s3";
import {createLogger} from "../utils/logger";

const logger = createLogger("deleteExpenseItemService");

export default async function deleteExpenseItemService(userId: string, expenseId: string)
  : Promise<void> {
  logger.debug("start deleteExpenseItemService");

  const expenseItem: ExpenseItem = await ddb.getExpense(userId, expenseId);
  if (expenseItem) {
    // Delete attachement from S3 bucket
    if (expenseItem.attachmentUrl) {
      await s3Svc.deleteAttachement(expenseId);
    }

    // Delete ExpenseItem from DynamoDB
    await ddb.deleteExpense(userId, expenseId);
  }

  logger.debug("end deleteExpenseItemService");
  return;
}
