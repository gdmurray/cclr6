import * as cloudTasks from '@google-cloud/tasks'
import { getDecrypted, accounts } from './admin'
import * as functions from 'firebase-functions'
import * as gAuth from 'google-auth-library'
import * as path from 'path'

import { validateHeader } from './utils'
import { getEmail } from './email/mail'

export function getProjectId(): string {
    return 'ccl-content'
}

export async function dispatchGCloudTask(
    payload: object
) {
    try {
        const projectId = getProjectId()
        if (!projectId) throw new Error('No Project ID found')
        const queue = 'send-email'
        const location = 'us-central1'
        const url = 'https://us-central1-ccl-content.cloudfunctions.net/sendEmail'
        const serviceAccount = JSON.parse(getDecrypted(accounts.GOOGLE))
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
        const email = getEmail()
        await email.send({
            template: path.resolve(`src/email/${template}`),
            message: {
                to: emailAddress
            },
            locals: variables
        })
    } catch (err) {
        throw new Error(err)
    }
}