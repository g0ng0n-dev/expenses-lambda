import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateExpenseRequest } from '../../requests/UpdateExpenseRequest'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../utils/utils';
import { ExpenseUpdate } from '../../models/ExpenseUpdate'
import updateExpenseItemService from '../../services/updateExpenseItemService';

const logger = createLogger("httpUpdateExpense");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("start httpUpdateExpense");
  const expenseId = event.pathParameters.expenseId
  const updatedExpenseItem: UpdateExpenseRequest = JSON.parse(event.body)
  const usedId = getUserId(event);
  const response: ExpenseUpdate = await updateExpenseItemService(usedId, expenseId, updatedExpenseItem);
  logger.debug(`end httpUpdateExpense`);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"item": response})
  };
}
