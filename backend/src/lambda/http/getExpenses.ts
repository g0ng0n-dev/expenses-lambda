import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from "../../utils/utils";
import { createLogger } from '../../utils/logger' ;
import getExpensesForUserService from '../../services/getExpensesForUserService';

const logger = createLogger("HttpGetTodosForCurrentUser");


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("start HttpGetExpensesForCurrentUser");
  const userId = getUserId(event);

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
  const items = await getExpensesForUserService(userId);

  logger.debug("end HttpGetExpensesForCurrentUser");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ items: items})
  };

}
