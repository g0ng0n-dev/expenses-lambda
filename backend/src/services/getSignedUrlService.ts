import { createLogger } from '../utils/logger';
import { ExpenseItem } from '../models/ExpenseItem';
import * as ddb from '../data/expense';
import * as s3Svc from '../data/s3';

const logger = createLogger("expenseDb");

export default async function getSignedUrlService(userId: string, expenseId: string)
  :Promise<string> {
  logger.debug("expenseBl.getSignedUrl - in");
  const expenseItem: ExpenseItem = await ddb.getExpense(userId, expenseId);

  //record/overwrite as a new attachment URL or update to existing one.
  if (expenseItem) {
    const downloadUrl :string = await s3Svc.getAttachementDownloadUrl(userId, expenseId);
    // Add/update attachementURL for Expense item in DB
    await ddb.updateExpenseAttachement(userId, expenseId, downloadUrl);

    // get signed/upload URL from S3
    const uploadUrl :string = await s3Svc.getAttachementUploadUrl(userId, expenseId);
    logger.debug("expenseBl.getSignedUrl - out 1");
    return uploadUrl;
  } else {
    logger.debug("expenseBl.getSignedUrl - out 2");
    return null;
  }
}
