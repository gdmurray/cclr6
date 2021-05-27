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
const received = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNkOWNmYWE4OGVmMDViNDI0YmU2MjA1ZjQ2YjE4OGQ3MzI1N2JjNDIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2NsLWNvbnRlbnQiLCJhdWQiOiJjY2wtY29udGVudCIsImF1dGhfdGltZSI6MTYyMjA3NjY0MSwidXNlcl9pZCI6InlkNGFwN0ZUaHdaTU9PaDhVNzNaRnZkRDFLUDIiLCJzdWIiOiJ5ZDRhcDdGVGh3Wk1PT2g4VTczWkZ2ZEQxS1AyIiwiaWF0IjoxNjIyMDc4NDk0LCJleHAiOjE2MjIwODIwOTQsImVtYWlsIjoiZ2QtbXVycmF5QGhvdG1haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImdkLW11cnJheUBob3RtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.M5ZQ3jL9iZVd2vNuK1scn5ObMz4ZkTyJqkl5GXaIlVzMgzKTlFY9n2pbL5pEs0otPVh4vfHq2V7sKvr_GZoceRkhxgZksSw6qh-LESPymdY6jg_rM5VAgOHKXUjIOwU9Dy1S78egZhXktXmRUy4HbAreJGJ6SlpHg8VOnNgxuZoPEK4R9DN70RVpNQ4QbWfye__OjxrTGclUWZV4OnnrS0H-PJ3WfLD8XIHCURyUEyew8DtNY-ohAnBYVuBEuhdEcVSw2ZLGMLfL_0sUEAb6NIbZ00-pwRLAX0LBXsLTa42Gat5gDsZKVi_9R4M6gZIHZ_nvQc-OG4ovxnlZgeKOhA'
const og = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNkOWNmYWE4OGVmMDViNDI0YmU2MjA1ZjQ2YjE4OGQ3MzI1N2JjNDIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2NsLWNvbnRlbnQiLCJhdWQiOiJjY2wtY29udGVudCIsImF1dGhfdGltZSI6MTYyMjA3NjY0MSwidXNlcl9pZCI6InlkNGFwN0ZUaHdaTU9PaDhVNzNaRnZkRDFLUDIiLCJzdWIiOiJ5ZDRhcDdGVGh3Wk1PT2g4VTczWkZ2ZEQxS1AyIiwiaWF0IjoxNjIyMDc4NDk0LCJleHAiOjE2MjIwODIwOTQsImVtYWlsIjoiZ2QtbXVycmF5QGhvdG1haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImdkLW11cnJheUBob3RtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.M5ZQ3jL9iZVd2vNuK1scn5ObMz4ZkTyJqkl5GXaIlVzMgzKTlFY9n2pbL5pEs0otPVh4vfHq2V7sKvr_GZoceRkhxgZksSw6qh-LESPymdY6jg_rM5VAgOHKXUjIOwU9Dy1S78egZhXktXmRUy4HbAreJGJ6SlpHg8VOnNgxuZoPEK4R9DN70RVpNQ4QbWfye__OjxrTGclUWZV4OnnrS0H-PJ3WfLD8XIHCURyUEyew8DtNY-ohAnBYVuBEuhdEcVSw2ZLGMLfL_0sUEAb6NIbZ00-pwRLAX0LBXsLTa42Gat5gDsZKVi_9R4M6gZIHZ_nvQc-OG4ovxnlZgeKOhA'
export const sendMail = async (req, emailAddress, template, variables): Promise<void> => {
    console.log(req.cookies.token)
    console.log(received === og)
    const user = await admin.auth().verifyIdToken(req.cookies.token)
    console.log('USER: ', user)
    const response = await fetch(isLocal() ? 'http://localhost:5001/ccl-content/us-central1/triggerEmail' : 'https://us-central1-ccl-content.cloudfunctions.net/sendEmail', {
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
    console.log('SENT MAIL: ', data)
    return Promise.resolve()
}

