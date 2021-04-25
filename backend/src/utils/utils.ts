import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";

import { createLogger } from '../utils/logger' ;


const logger = createLogger("utils");

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  logger.debug("utils.getUserId - in ${uid}");
  const authorization = event.headers.Authorization

  const split = authorization.split(' ')
  const jwtToken = split[1]
  const uid = parseUserId(jwtToken);

  logger.debug(`utils.getUserId - out. uid: ${uid}`);
  return uid;
}
