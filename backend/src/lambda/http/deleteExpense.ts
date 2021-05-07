import 'source-map-support/register'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../utils/utils';
import * as uuid from 'uuid';
import deleteExpenseItemService from '../../services/deleteExpenseItemService';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const logger = createLogger("HttpDeleteExpense");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const eventId = uuid.v4()
  logger.debug(`start HttpDeleteExpense - ${eventId}`);
  const expenseId = event.pathParameters.expenseId
  const uid = getUserId(event);
  await deleteExpenseItemService(uid, expenseId);
  logger.debug(`end HttpDeleteExpense - ${eventId}`);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ""
  };
}
