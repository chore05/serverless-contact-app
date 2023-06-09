# Serverless Contact Form App

This project is a serverless, using AWS Lambda and Serverless framework to enable use secure save a contact information for your contacts. There is a check box present to represent favorite contacts.

# Functionality of the application

This application will allow creating/removing/updating/fetching CONTACT items. Each CONTACT item can optionally have an attachment image which is the profile image of a contact. Each user only has access to CONTACT list that he/she has created.

# CONTACT items

The application should store CONTACT items, and each CONTACT item contains the following fields:

* `contactId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a CONTACT item (e.g. "John Doe")
* `phoneNumber` (int) - phone numeber of CONTACT item
* `address` (string) - a summary text of the CONTACT item 
* `dueDate` (string) - date and time by which an item should be contacted
* `done` (boolean) - true if favorite CONTACT, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a CONTACT profile.

You might also store an id of a user who created a CONTACT item.

## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@2.21.1
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login
   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```
   
# Functions to be implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetContacts` - should return all CONTACTs for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "items": [
    {
      "contactId": "123",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "John Doe",
      "phoneNumber":"00124563987",
      "address":"0023 ST, Ireland ",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "favorite": false,
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "contactId": "456",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Paul West",
      "phoneNumber":"00123456789",
      "address": "0456 MD, Brokant Avenue",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "favorite": true,
      "attachmentUrl": "http://example.com/image.png"
    },
  ]
}
```

* `CreateContact` - should create a new CONTACT for a current user. A shape of data send by a client application to this function can be found in the `CreateContactRequest.ts` file

It receives a new CONTACT item to be created in JSON format that looks like this:

```json
{
  "createdAt": "2019-07-27T20:01:45.424Z",
  "name": "John Doe",
  "phoneNumber":"00124563987",
  "address":"0023 ST, Ireland ",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "favorite": false,
  "attachmentUrl": "http://example.com/image.png"
}
```

It should return a new CONTACT item that looks like this:

```json
{
  "item": {
    "contactId": "123",
    "createdAt": "2019-07-27T20:01:45.424Z",
    "name": "John Doe",
    "phoneNumber":"00124563987",
    "address":"0023 ST, Ireland ",
    "dueDate": "2019-07-29T20:01:45.424Z",
    "favorite": false,
    "attachmentUrl": "http://example.com/image.png"
  }
}
```

* `UpdateContact` - should update a CONTACT item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateContactRequest.ts` file

It receives an object that contains four fields that can be updated in a CONTACT item:

```json
{
  "name": "John Paul",
  "phoneNumber":"00124563987",
  "address":"0025 JK, Iceland ",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "favorite": true
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeleteContact` - should delete a CONTACT item created by a current user. Expects an id of a CONTACT item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a CONTACT item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.us-east-1.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.


# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication in your application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. We recommend using asymmetrically encrypted JWT tokens.

# Best practices

We included logging information in the code to enable us trace issues or different execution steps of the backend.

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```


# Application Hints

I have set the `apiId` and Auth0 parameters in the `config.ts` file in the `client` folder. When you start the React development server to run the frontend it interacts with the serverless application.

**IMPORTANT**

*The application will be running until after submission is reviewed.*

# Suggestions

To store CONTACT items, you might want to use a DynamoDB table with local secondary index(es). A create a local secondary index you need to create a DynamoDB resource like this:

```yml

CONTACTsTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: partitionKey
        AttributeType: S
      - AttributeName: sortKey
        AttributeType: S
      - AttributeName: indexKey
        AttributeType: S
    KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.CONTACTS_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.INDEX_NAME}
        KeySchema:
          - AttributeName: partitionKey
            KeyType: HASH
          - AttributeName: indexKey
            KeyType: RANGE
        Projection:
          ProjectionType: ALL # What attributes will be copied to an index

```

To query an index you need to use the `query()` method like:

```ts
await this.dynamoDBClient
  .query({
    TableName: 'table-name',
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  })
  .promise()
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless CONTACT application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/collection-3.png?raw=true "Image 3")


Provide the variables for the collection:

![Alt text](images/collection-4.png?raw=true "Image 4")

## Note
- I am using node version 18 for this project so if you come across any issues starting the frontend or backend, set the enviroment variable before running `npm run start` for frontend or `serverless deploy` for backend
```windows
SET NODE_OPTIONS=--openssl-legacy-provider
```

- The Phone number field must contain at most 8 digits
- the address field and name field must be filled before creating a new contact
