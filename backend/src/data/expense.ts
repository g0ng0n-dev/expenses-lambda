import * as AWS from 'aws-sdk';
import { ExpenseItem } from '../models/ExpenseItem';
import { ExpenseUpdate } from '../models/ExpenseUpdate';
import { createLogger } from '../utils/logger';

const logger = createLogger("expenseDb");

// const AWSXRay = require('aws-xray-sdk');
// const AWS = AWSXRay.captureAWS(AWSb)

const tbl = process.env.EXPENSES_TABLE
const idx = process.env.EXPENSES_USR_INDEX

let dbDocClient: AWS.DynamoDB.DocumentClient;
if (process.env.IS_OFFLINE) {
  dbDocClient = new AWS.DynamoDB.DocumentClient({ endpoint: 'http://localhost:8000' });
} else {
  dbDocClient = new AWS.DynamoDB.DocumentClient();
}

export async function createExpense(expenseDb: ExpenseItem): Promise<ExpenseItem> {
  logger.debug("expenseDb.createExpense - in");

  await dbDocClient.put({
    TableName: tbl,
    Item: expenseDb
  }).promise();

  logger.debug("expenseDb.createExpense - out");
  return expenseDb;
}

export async function getExpense(userId: string, expenseId: string): Promise<ExpenseItem> {
  logger.debug("expenseDb.getExpense - in");

  const result = await dbDocClient.get({
    TableName: tbl,
    Key: {
      userId: userId,
      expenseId: expenseId
    }
  }).promise();

  logger.debug("expenseDb.getExpense - out");
  return result.Item as ExpenseItem;
}

export async function getExpenseByUser(userId: string): Promise<ExpenseItem[]> {
  logger.debug("expenseDb.getExpenseByUser - in");

  const result = await dbDocClient.query({
    TableName: tbl,
    IndexName: idx,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId }
  }).promise();

  logger.debug("expenseDb.getExpenseByUser - out");
  return result.Items as ExpenseItem[];
}

export async function updateExpense(userId: string, expenseId: string, upd: ExpenseUpdate): Promise<ExpenseUpdate> {
  logger.debug("expenseDb.updateExpense - in");

  // Name is reserved word in DynamoDB.
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
  await dbDocClient.update({
    TableName: tbl,
    Key: { userId: userId, expenseId: expenseId },
    UpdateExpression: "set #merchantName=:nm, #date=:dd, #amount=:am",
    ExpressionAttributeValues: {
      ":nm": upd.merchantName,
      ":dd": upd.date,
      ":am": upd.amount
    },
    ExpressionAttributeNames: {
      "#merchantName": "merchantName",
      "#date": "date",
      "#amount": "amount",
    },
    ReturnValues: "UPDATED_NEW"
  }).promise();

  logger.debug("expenseDb.updateExpense - out");
  return upd;
}

export async function updateExpenseAttachement(userId: string, expenseId: string, downloadUrl: string)
  :Promise<void> {

  logger.debug("expenseDb.updateExpenseAttachement - in");
  await dbDocClient.update({
    TableName: tbl,
    Key: { userId: userId, expenseId: expenseId },
    UpdateExpression: "set attachmentUrl=:aur",
    ExpressionAttributeValues: {
      ":aur": downloadUrl
    },
    ReturnValues: "UPDATED_NEW"
  }).promise();

  logger.debug("expenseDb.updateExpenseAttachement - out");
  return ;
}

export async function deleteExpense(userId: string, expenseId: string): Promise<void> {
  logger.debug("expenseDb.deleteExpense - in");

  await dbDocClient.delete({ TableName: tbl, Key: { userId, expenseId } }).promise();

  logger.debug("expenseDb.deleteExpense - out");
}
