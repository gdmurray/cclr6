import { google, drive_v3 } from 'googleapis'
import decrypted from '../secret/google-account'

export async function getDriveClient(): Promise<drive_v3.Drive> {
    try {
        const SCOPES = [
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/drive.metadata.readonly',
        ]
        const googleAccount = decrypted
        const jwt = new google.auth.JWT(
            googleAccount.client_email,
            null,
            googleAccount.private_key.replace(/\\n/g, '\n'),
            SCOPES
        )
        const drive = google.drive({ version: 'v3', auth: jwt })
        return Promise.resolve(drive)
    } catch (err) {
        console.log(err)
        return Promise.reject(err)
    }
}
