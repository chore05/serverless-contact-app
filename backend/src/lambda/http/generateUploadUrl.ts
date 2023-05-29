import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/contacts'
//import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const contactId = event.pathParameters.contactId
    // presigned URL to upload a file for a BLOG item with the provided id
    const presignedUrl = await createAttachmentPresignedUrl(contactId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        'uploadUrl': presignedUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      headers: true,
      origin: '*'
    })
  )
