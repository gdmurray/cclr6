import decrypted from '@lib/secret/google-account'
import * as cloudTasks from '@google-cloud/tasks'

export enum RegistrationTaskType {
    TEAM_REGISTER = 'TEAM_REGISTER',
    TEAM_UNREGISTER = 'TEAM_UNREGISTER',
    PLAYER_UPDATE = 'PLAYER_UPDATE',
    TEAM_UPDATE = 'TEAM_UPDATE',
}

export type RegistrationTask = {
    type: RegistrationTaskType
    event: string
    team: {
        id: string
        name?: string
        contact_email?: string
        paid?: boolean
        registered?: boolean
    }
    players: {
        id: string
        index: number
        uplay: string
        country: string
        email: string
        is_captain: boolean
    }[]
}

export async function dispatchTask(body: RegistrationTask) {
    if (process.env.NODE_ENV === 'development') {
        try {
            await fetch('http://localhost:5001/ccl-content/us-central1/updateTeamRegistrationSheet', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        } catch (err) {
            console.log('Local function service not running')
        }
        return Promise.resolve()
    }
    try {
        const projectId = 'ccl-content'
        const queue = 'registration-handler'
        const location = 'us-central1'
        const url = 'https://us-central1-ccl-content.cloudfunctions.net/updateTeamRegistrationSheet'
        const serviceAccountEmail = decrypted.client_email

        const client = new cloudTasks.CloudTasksClient({
            credentials: {
                client_email: decrypted.client_email,
                private_key: decrypted.private_key,
            },
        })

        const parent = client.queuePath(projectId, location, queue)

        const httpReq = {
            httpMethod: cloudTasks.protos.google.cloud.tasks.v2.HttpMethod.POST,
            body: Buffer.from(JSON.stringify(body)),
            url: url,
            oidcToken: { serviceAccountEmail },
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const task = { httpRequest: httpReq }
        const request = { parent, task }
        console.log('CREATING TASK')
        await client.createTask(request)
        console.log('TASK SENT')
        return Promise.resolve()
    } catch (err) {
        console.log('ERROR DISPATCHING TASK: ', err)
        return Promise.resolve()
    }
}
