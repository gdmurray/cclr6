import { getDriveClient } from '@lib/api/drive'

interface Rulebook {
    data: string
    modifiedTime: string
}

export async function getRulebook(): Promise<Rulebook> {
    const driveClient = await getDriveClient()
    const ruleBookResponse = await driveClient.files.export({
        fileId: '1ZSsmHhXRR3OU2c_VnDBlGnujQFLE4JK66wUe5e3zmwA',
        mimeType: 'text/plain',
    })
    const rulebook = await driveClient.files.get({
        fileId: '1ZSsmHhXRR3OU2c_VnDBlGnujQFLE4JK66wUe5e3zmwA',
        fields: 'modifiedTime',
    })
    if (rulebook.status === 200 && ruleBookResponse.status === 200) {
        const { data } = ruleBookResponse as { data: string }
        const { data: metadata } = rulebook
        const { modifiedTime } = metadata
        return Promise.resolve({ data, modifiedTime })
    }
    return Promise.reject(ruleBookResponse.data)
}
