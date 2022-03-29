import { google, youtube_v3 } from 'googleapis'
import decrypted from '@lib/secret/google-account'

export async function getYoutubeClient(): Promise<youtube_v3.Youtube> {
    try {
        const scopes = ['https://www.googleapis.com/auth/youtube.readonly']
        const googleAccount = decrypted
        const jwt = new google.auth.JWT(
            googleAccount.client_email,
            null,
            googleAccount.private_key.replace(/\\n/g, '\n'),
            scopes
        )

        const client = google.youtube({ version: 'v3', auth: jwt })
        return Promise.resolve(client)
    } catch (err) {
        return Promise.reject(err)
    }
}
