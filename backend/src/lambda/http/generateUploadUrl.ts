import 'source-map-support/register'
import { getUserId } from "../../utils/utils";
import { createLogger } from '../../utils/logger' ;
import getSignedUrlService from '../../services/getSignedUrlService' ;
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const logger = createLogger("HttpGenerateUploadUrl");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.debug("start HttpGenerateUploadUrl");

  const userId = getUserId(event);
  const expenseId = event.pathParameters.expenseId
  const uploadedUrl :string = await getSignedUrlService(userId, expenseId);

  if (uploadedUrl) {
    logger.debug("end HttpGenerateUploadUrl");
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify( {
        "uploadUrl": uploadedUrl
      })
    }
  } else {
    logger.debug("End HttpGenerateUploadUrl - Not Found");
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "{}"
    }
  }
}
