import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getContactsForUser as getContactsForUser } from '../../businessLogic/contacts'
import { getUserId } from '../utils';

// Get all BLOG items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const uid = getUserId(event)
    const contacts = await getContactsForUser(uid)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: contacts
      })
    }
  }
)


handler.use(
  cors({
    credentials: true,
    origin: '*',
    headers: true
  })
)
