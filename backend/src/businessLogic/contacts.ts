import { ContactsAccess } from '../dataLayer/contactsAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { ContactItem } from '../models/ContactItem'
import { CreateContactRequest } from '../requests/CreateContactRequest'
import { UpdateContactRequest } from '../requests/UpdateContactRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

//  Implementation of businessLogic for Contact app
const logger = createLogger("Contact Business Logic:")
const contactAccess = new ContactsAccess()

export async function getContactsForUser(uid:string): Promise<ContactItem[]> {
    try {
       logger.info("Querying Database for Contacts list ...")
       return await contactAccess.getContactsForUser(uid)
    } catch(err) {
       logger.error("Error: ", createError(err.message))
    }
}

export async function createContact(userid:string, newContact:CreateContactRequest): Promise<ContactItem> {
    const contactId: uuid = uuid.v4()
    const createdAt: string = Date.now().toString()
    const s3BucketName:string = process.env.ATTACHMENT_S3_BUCKET;
    const key:string = `${contactId}-img`
    const attachmentUrl: string = `https://${s3BucketName}.s3.amazonaws.com/${key}`
    const newContactItem: ContactItem = {
        'userId': userid,
        'contactId': contactId,
        'createdAt': createdAt,
        'name': newContact.name,
        'phoneNumber': newContact.phoneNumber,
        'address': newContact.address,
        'dueDate': newContact.dueDate,
        'favorite': false,
        'attachmentUrl': attachmentUrl
    }

    try{
        logger.info("Adding new contact item ...")
        return await contactAccess.createContact(newContactItem)
    } catch(err){
        logger.error("Error: ", createError(err.message))
    }
}

export async function updateContact(updatedContact:UpdateContactRequest, uid:string, cid: string): Promise<UpdateContactRequest> {
    try{
        logger.info("Updating contact ...")
        return contactAccess.updateContact(uid, cid, updatedContact)
    }catch(err){
        logger.error("Error: ", createError(err.message))
    }
}

export async function deleteContact(uid:string, contactId:string) {
    try{
        logger.info("Deletion in contact ...")
        await contactAccess.deleteContact(uid, contactId)
    } catch(err){
        logger.error("Error: ", createError(err.message))
    }
}

export async function createAttachmentPresignedUrl(contactId:string): Promise<string> {
    logger.info("Creating signed url ...")
    const attachmentUtils = new AttachmentUtils()
    try{
        return await attachmentUtils.createUploadUrl(contactId)
    } catch(e){
        logger.error("Error: ", createError(e.message))
    }
}
