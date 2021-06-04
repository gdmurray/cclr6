import * as nodemailer from 'nodemailer'
// @ts-ignore
import Email from 'email-templates'
import * as path from 'path'
import * as aws from 'aws-sdk'
import * as functions from 'firebase-functions'

const base64ToS3 = require('nodemailer-base64-to-s3')


aws.config.update({
    accessKeyId: functions.config().aws.id,
    secretAccessKey: functions.config().aws.secret,
    region: 'us-east-1'
})

const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: 'us-east-1'
})

export const transporter = nodemailer.createTransport({
    SES: { ses, aws }
})

transporter.use('compile', base64ToS3({
    aws: {
        accessKeyId: functions.config().aws.id,
        secretAccessKey: functions.config().aws.secret,
        params: {
            Bucket: 'cclr6'
        }
    }
}))

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
            // preview: process.env.FUNCTION_EMULATOR === 'true',
            send: true, // process.env.FUNCTIONS_EMULATOR !== 'true',
            transport: transporter,
            subjectPrefix: process.env.FUNCTIONS_EMULATOR !== 'production' ? 'CCLR6: ' : 'DEVCCL: '
        }
    )
}