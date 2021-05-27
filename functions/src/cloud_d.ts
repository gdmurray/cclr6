// import * as cloudTasks from '@google-cloud/tasks'

export function getProjectId(): string {
    return 'ccl-content'
}

export async function dispatchGCloudTask(
    payload: object,
    urlExt: string,
    queue: string,
    inSeconds?: number
) {
    try {
        const projectId = getProjectId();
        if (!projectId) throw new Error("No Project ID found");

        // const url = `https://${projectId}.web.app/${urlExt}`;
        // const serviceAccountEmail = `cloud-tasks@${projectId}.iam.gserviceaccount.com`;
        //
        // // Instantiate a cloud task client & construct the fully qualified queue name.
        // const client = new cloudTasks.CloudTasksClient();
        // const parent = client.queuePath(projectId, "us-central1", queue);

        return Promise.resolve();
    } catch (error) {
        // re-throw error to caller
        return Promise.reject(new Error("Task dispatch failed."));
    }
}