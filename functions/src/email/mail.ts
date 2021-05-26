import * as nodemailer from 'nodemailer'
// @ts-ignore
import Email from 'email-templates'
import * as path from 'path'
import * as aws from 'aws-sdk'
import * as functions from 'firebase-functions'

aws.config.update({
    accessKeyId: functions.config().aws.id,
    secretAccessKey:functions.config().aws.secret,
    region: 'us-east-1'
})

const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: 'us-east-1'
})

export const transporter = nodemailer.createTransport({
    SES: { ses, aws }
})

const env = 'production'
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