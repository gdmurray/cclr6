import { NextApiRequest, NextApiResponse } from 'next'
import apiClient from '@lib/api/twitch'

export default async function live(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).end()
    }
    try {
        const stream = await apiClient.streams.getStreamByUserName(process.env['TWITCH_CHANNEL'])
        if (stream != null) {
            return res.status(200).json({ status: 'live' })
        }
        return res.status(200).json({ status: 'offline' })
    } catch (err) {
        console.log('Error: ', err)
        return res.status(200).json({ status: 'offline' })
    }
}
