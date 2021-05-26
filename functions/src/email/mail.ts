import * as nodemailer from 'nodemailer'
// @ts-ignore
import Email from 'email-templates'
import * as path from 'path'
import * as aws from 'aws-sdk'

aws.config.update({
    accessKeyId: process.env.SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_ACCESS_KEY_SECRET,
    region: 'us-east-1'
})

const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: 'us-east-1'
})

export const transporter = nodemailer.createTransport({
    SES: { ses, aws }
})

const env = process.env.NODE_ENV || 'development'
export const getEmail = (from: string = 'noreply@cclr6.com') => {
    return new Email(
        {
            juice: true,
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    relativeTo: path.resolve('src/email'),
                    images: true
                }
            },
            message: {
                from
            },
            send: true,
            transport: transporter,
            subjectPrefix: env === 'production' ? 'CCLR6: ' : 'DEVCCL: '
        }
    )
}