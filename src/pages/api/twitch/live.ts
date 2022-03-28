import { NextApiRequest, NextApiResponse } from 'next'
import apiClient from '@lib/api/twitch'

const ccl_titles = ['CCL', 'Canada Contenders League', 'Canada Contenders']
export default async function live(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).end()
    }
    const twitch_channel = process.env['TWITCH_CHANNEL'] ?? 'NorthernArena'
    try {
        const stream = await apiClient.streams.getStreamByUserName(twitch_channel)
        if (stream != null && ccl_titles.some((elem) => stream.title.includes(elem))) {
            return res.status(200).json({ status: 'live' })
        }
        return res.status(200).json({ status: 'offline' })
    } catch (err) {
        console.log('Error: ', err)
        return res.status(200).json({ status: 'offline' })
    }
}
