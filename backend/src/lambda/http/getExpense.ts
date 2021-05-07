import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from "../../utils/utils";
import { createLogger } from '../../utils/logger' ;
import getExpenseItemService from '../../services/getExpenseForUserService'

const logger = createLogger("HttpGetTodosForCurrentUser");


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("start HttpGetExpensesForCurrentUser");
  const userId = getUserId(event);
  const expenseId = event.pathParameters.expenseId

  if (!userId){
    logger.debug("end HttpGetExpensesForCurrentUser - error");
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "{}"
    };
  }
  const expense = await getExpenseItemService(userId, expenseId);

  logger.debug("end HttpGetExpensesForCurrentUser");
  if (!expense){
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ })
    };
  }
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ expense: expense})
  };

}
