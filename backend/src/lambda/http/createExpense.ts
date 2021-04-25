import 'source-map-support/register'
import { getUserId } from '../../utils/utils';
import { ExpenseItem } from '../../models/ExpenseItem'
import { CreateExpenseRequest } from '../../requests/CreateExpenseRequest'
import createExpenseItemService from '../../services/createExpenseItemService'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger';
import * as uuid from 'uuid';

const logger = createLogger("HttpCreateTodo");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  const eventId = uuid.v4()

  logger.debug(`start HttpCreateExpense- ${eventId}`);
  const newExpenseItm: CreateExpenseRequest = JSON.parse(event.body)
  const uid = getUserId(event);
  const ret: ExpenseItem = await createExpenseItemService(uid, newExpenseItm);
  logger.debug(`end HttpCreateExpense - ${eventId}`);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"item": ret})
  };
}
