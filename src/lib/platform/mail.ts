// import * as nodemailer from 'nodemailer'
// import Email from 'email-templates'
// import * as path from 'path'
// import * as aws from 'aws-sdk'
import config from './config'
import { isLocal } from '@lib/platform/env'
import admin from '@lib/firebase/admin'
//
// aws.config.update({
//     accessKeyId: process.env.SES_ACCESS_KEY_ID,
//     secretAccessKey: process.env.SES_ACCESS_KEY_SECRET,
//     region: 'us-east-1'
// })
//
// const ses = new aws.SES({
//     apiVersion: '2010-12-01',
//     region: 'us-east-1'
// })
//
// export const transporter = nodemailer.createTransport({
//     SES: { ses, aws }
// })
//
// const env = process.env.NODE_ENV || 'development'
// export const getEmail = (from: string = 'noreply@cclr6.com'): typeof Email => {
//     return new Email(
//         {
//             juice: true,
//             juiceResources: {
//                 preserveImportant: true,
//                 webResources: {
//                     relativeTo: path.resolve('src/email'),
//                     images: true
//                 }
//             },
//             message: {
//                 from
//             },
//             send: true,
//             transport: transporter,
//             subjectPrefix: env === 'production' ? 'CCLR6: ' : 'DEVCCL: '
//         }
//     )
// }
//
export const defaultLocals = {
    website: config.base_url,
    twitter: config.socials.twitter,
    twitch: config.socials.twitch,
    discord: config.socials.discord,
    contact_email: config.contact_email,
    year: new Date().getFullYear()
}

export const sendMail = async (req, emailAddress, template, variables): Promise<void> => {
    const response = await fetch(isLocal() ? 'http://localhost:5001/ccl-content/us-central1/triggerEmail' : 'https://us-central1-ccl-content.cloudfunctions.net/triggerEmail', {
        method: 'POST',
        body: JSON.stringify({
            template,
            emailAddress,
            variables: {
                ...defaultLocals,
                variables
            }
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${req.cookies.token}`
        }
    })
    const data = await response.json()
    return Promise.resolve()
}

