import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import * as jwtp from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
import {SigningKey} from "jwks-rsa";
const logger = createLogger('auth')
const jwksClient = require('jwks-rsa');

const jwksUrl = 'https://dev-l6as-0pv.us.auth0.com/.well-known/jwks.json'

const client = jwksClient({
  jwksUri: jwksUrl,
  requestHeaders: {}, // Optional
  timeout: 30000 // Defaults to 30s
});

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

/**
 *  From samples at https://www.npmjs.com/package/jsonwebtoken and https://github.com/auth0/node-jwks-rsa
 *
 * @param hdr : JwtHeader
 * @param cb
 */
function getKey(hdr :jwtp.JwtHeader, jwtCb ) {
  client.getSigningKey(hdr.kid, function(err :Error, key :SigningKey) {
    if (err) {
      jwtCb(err, null);
    } else {
      let signingKey = key.getPublicKey();
      jwtCb(null, signingKey);
    }
  });
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  logger.debug("start auth0Authorizer.verifyToken");

  const token = getToken(authHeader)

  logger.debug("end auth0Authorizer.verifyToken");

  return  new Promise<JwtPayload>( function (resolve, reject) {

    jwtp.verify(token, getKey, (err, decoded : JwtPayload) => {

      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }

    });

  });
}

function getToken(authHeader: string): string {
  logger.debug("start auth0Authorizer.getToken");

  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  logger.debug("end auth0Authorizer.getToken");
  return token
}
