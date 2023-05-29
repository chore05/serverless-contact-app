import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateContactRequest } from '../../requests/CreateContactRequest'
import { getUserId } from '../utils';
import { createContact } from '../../businessLogic/contacts'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newContact: CreateContactRequest = JSON.parse(event.body)
    //creating a new BLOG item
    const uid = getUserId(event)
    const contactItemm = await createContact(uid, newContact)
    return {
      statusCode: 201,
      body: JSON.stringify({item: contactItemm})
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
