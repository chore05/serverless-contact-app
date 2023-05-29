import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateContact } from '../../businessLogic/contacts'
import { UpdateContactRequest } from '../../requests/UpdateContactRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const contactId = event.pathParameters.contactId
    const updatedContact: UpdateContactRequest = JSON.parse(event.body)
    // Update a BLOG item with the provided id using values in the "updatedContact" object
    const uid = getUserId(event)
    const contactitem = await updateContact(updatedContact, uid, contactId)

    return {
      statusCode: 202,
      body: JSON.stringify({
        contactitem
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      origin: '*',
      headers: true
    })
  )
