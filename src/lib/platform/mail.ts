import config from './config'
import decrypted from '@lib/secret/google-account'
import { isLocal } from '@lib/platform/env'
import * as cloudTasks from '@google-cloud/tasks'


export const defaultLocals = {
    website: config.base_url,
    twitter: config.socials.twitter,
    twitch: config.socials.twitch,
    discord: config.socials.discord,
    contact_email: config.contact_email,
    year: new Date().getFullYear()
}

export const sendMail = async (req, emailAddress, template, variables): Promise<void> => {
    console.log('QUEUING MAIL')
    try {
        const projectId = 'ccl-content'
        const queue = 'send-email'
        const location = 'us-central1'
        const url = 'https://us-central1-ccl-content.cloudfunctions.net/sendEmail'
        const serviceAccountEmail = decrypted.client_email

        const client = new cloudTasks.CloudTasksClient({
            credentials: {
                client_email: decrypted.client_email,
                private_key: decrypted.private_key,
            }
        })

        const parent = client.queuePath(projectId, location, queue)

        const httpReq = {
            httpMethod: cloudTasks.protos.google.cloud.tasks.v2.HttpMethod.POST,
            url: url,
            body: Buffer.from(JSON.stringify({
                template,
                emailAddress,
                variables: { ...defaultLocals, ...variables }
            })).toString('base64'),
            oidcToken: { serviceAccountEmail },
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const task = { httpRequest: httpReq }

        const request = { parent, task }
        console.log('CREATING TASK')
        await client.createTask(request)
        console.log("TASK SENT")
        return Promise.resolve()
    } catch (e) {
        console.log('ERROR', e)
        console.log(e.code)
        console.log(e.message)
        return Promise.resolve()
    }

}

