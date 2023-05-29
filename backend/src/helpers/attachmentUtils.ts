import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const signVersion = new XAWS.S3({signatureVersion: 'v4'})

// FileStogare logic
export class AttachmentUtils {
    constructor(
        private readonly s3BucketName:string = process.env.ATTACHMENT_S3_BUCKET
    ){}
        async createUploadUrl(contactid:string): Promise<string>{
            const expireDate:number = parseInt(process.env.SIGNED_URL_EXPIRATION)
            const uploadUrl:string = await signVersion.getSignedUrl(
                'putObject',
                {
                    Bucket: this.s3BucketName,
                    Key: `${contactid}-img`,
                    Expires: expireDate
                })

            return uploadUrl
        }
    
}