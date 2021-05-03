import * as nodemailer from 'nodemailer'
import AWS from 'aws-sdk'

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    region: 'us-east-1'
})

const ses = new AWS.SES({
    apiVersion: '2010-12-01',
    region: 'us-east-1'
})

export const transporter = nodemailer.createTransport({
    SES: { ses, AWS }
})
