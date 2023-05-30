import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk') 
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { ContactUpdate } from '../models/ContactUpdate';
import { UpdateContactRequest } from '../requests/UpdateContactRequest'
import { ContactItem } from '../models/ContactItem'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('ContactsAccess')

// dataLayer logic
export class ContactsAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly createAtIndex:string = process.env.CONTACTS_CREATED_AT_INDEX,
        private readonly contactTable: string = process.env.CONTACTS_TABLE
    ){}

    async getContactsForUser(userId:string): Promise<ContactItem[]>{
            logger.info(`Get all Contact Items for user`)
            const results = await this.docClient.query({
                TableName: this.contactTable,
                IndexName: this.createAtIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }

            }).promise()
            return results.Items as ContactItem[]
    }

    async createContact(newContact:ContactItem): Promise<ContactItem> {
        logger.info("Create new contact ...")
        await this.docClient.put({
            TableName: this.contactTable,
            Item: newContact
        }).promise()

        return newContact
    }

    async updateContact(uId: string, contactId: string, updateContact:UpdateContactRequest): Promise<ContactUpdate>{
        const item = await this.docClient.update({
            TableName: this.contactTable,
            Key: {
                'userId': uId, 
                'contactId': contactId
            },
            ExpressionAttributeNames: {
                '#NAMES': 'name',
                '#PHONE': 'phoneNumber',
                '#ADD': 'address',
                '#DATE': 'dueDate',
                '#FAV': 'favorite'
            },
            UpdateExpression: 'SET #NAMES = :name, \
                                    #PHONE = :phoneNumber, \
                                    #ADD = :address, \
                                    #DATE = :dueDate, \
                                    #FAV = :favorite',
            ExpressionAttributeValues: {
                ':name': updateContact.name,
                ':phoneNumber': updateContact.phoneNumber,
                ':address': updateContact.address,
                ':dueDate': updateContact.dueDate,
                ':favorite': updateContact.favorite
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise()

        return item.Attributes as ContactUpdate
    }

    async deleteContact(uId:string, contactId:string) {
        await this.docClient.delete({
            TableName: this.contactTable,
            Key: {'userId': uId, 'contactId': contactId}
        }).promise()
    }
}
