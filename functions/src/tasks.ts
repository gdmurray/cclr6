import * as cloudTasks from '@google-cloud/tasks'
import { getDecrypted, accounts } from './admin'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as gAuth from 'google-auth-library'
import * as path from 'path'

import { validateHeader } from './utils'
import { getEmail } from './email/mail'

export function getProjectId(): string {
    return 'ccl-content'
}

const firebaseAccount = JSON.parse(getDecrypted(accounts.FIREBASE))

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: firebaseAccount.project_id,
        clientEmail: firebaseAccount.client_email,
        privateKey: firebaseAccount.private_key
    })
})

export async function dispatchGCloudTask(
    payload: object
) {
    try {
        const projectId = getProjectId()
        if (!projectId) throw new Error('No Project ID found')
        const queue = 'send-email'
        const location = 'us-central1'
        const url = 'https://us-central1-ccl-content.cloudfunctions.net/sendEmail'
        const decrypted = getDecrypted(accounts.GOOGLE)
        const serviceAccount = JSON.parse(decrypted)
        const serviceAccountEmail = serviceAccount.client_email

        const client = new cloudTasks.CloudTasksClient()
        const parent = client.queuePath(projectId, location, queue)

        const httpReq = {
            httpMethod: cloudTasks.protos.google.cloud.tasks.v2.HttpMethod.POST,
            url: url,
            body: '',
            oidcToken: { serviceAccountEmail },
            headers: {
                'Content-Type': 'application/json'
            }
        }

        if (payload) {
            httpReq.body = Buffer.from(JSON.stringify(payload)).toString('base64')
        }

        const task = { httpRequest: httpReq }
        const request = { parent, task }
        await client.createTask(request)

        return Promise.resolve()
    } catch (error) {
        functions.logger.error('TASK FAILED: ', error)
        // re-throw error to caller
        return Promise.reject(new Error('Task dispatch failed.'))
    }
}

export async function verifyCloudTaskRequest(request: functions.https.Request) {
    try {
        const serviceAccount = JSON.parse(getDecrypted(accounts.GOOGLE))
        const serviceAccountEmail = serviceAccount.client_email
        const oidcToken = validateHeader(request)
        const projectId = getProjectId()
        if (!projectId) throw new Error('No Project ID found')

        const client = new gAuth.OAuth2Client()

        const aud = `https://us-central1-ccl-content.cloudfunctions.net/sendEmail`

        const ticket = await client.verifyIdToken({
            idToken: oidcToken,
            audience: aud
        })

        const payload = ticket.getPayload()
        if (!payload) throw new Error(`OIDC Token did not have payload`)

        if (payload.email !== serviceAccountEmail) {
            throw new Error(`Cloud Task Request made by invalid email: ${payload.email}. Do not process!`)
        }
        return Promise.resolve()
    } catch (error) {
        console.log(error)
        return Promise.reject(new Error('Verify Cloud Task Request failed.'))
    }
}

interface EmailBody {
    template: string;
    emailAddress: string;
    variables: Record<any, any>
}

export async function sendMail({ template, emailAddress, variables }: EmailBody) {
    try {
        functions.logger.info('Preparing to send email')
        const email = getEmail()
        if (template === 'forgot_password') {
            const link = await admin.auth().generatePasswordResetLink(emailAddress, {
                url: `https://cclr6.com/login`
            })

            if (link) {
                variables = {
                    ...variables,
                    cta_url: link
                }
            } else {
                throw new Error('Could not generate link')
            }
        } else if (template === 'verify') {
            const link = await admin.auth().generateEmailVerificationLink(emailAddress, {
                url: `https://cclr6.com`
            })

            if (link) {
                variables = {
                    ...variables,
                    cta_url: link
                }
            } else {
                throw new Error('Could not generate link')
            }
        }
        await email.send({
            template: path.resolve(`src/email/${template}`),
            message: {
                to: emailAddress
            },
            locals: variables
        })
        functions.logger.info('Sent Email')
    } catch (err) {
        throw new Error(err)
    }
}