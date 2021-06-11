import { getDriveClient } from '@lib/api/drive'

interface FAQ {
    data: string
    modifiedTime: string
}

export async function getFAQ(): Promise<FAQ> {
    const driveClient = await getDriveClient()
    const faqResponse = await driveClient.files.export({
        fileId: '1TJDVi7MZoBBsprPTz0qZtg5nrEOynM0bRJAdsFfIU1Y',
        mimeType: 'text/plain',
    })
    const faqMetadata = await driveClient.files.get({
        fileId: '1TJDVi7MZoBBsprPTz0qZtg5nrEOynM0bRJAdsFfIU1Y',
        fields: 'modifiedTime',
    })

    if (faqMetadata.status === 200 && faqResponse.status === 200) {
        const { data } = faqResponse as { data: string }
        const { data: metadata } = faqMetadata
        const { modifiedTime } = metadata
        return Promise.resolve({ data, modifiedTime })
    }
    return Promise.reject(faqResponse.data)
}
