import { NextApiRequest, NextApiResponse } from 'next'
import { ToornamentClient } from '@lib/api/toornament'

export default async function participants(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    const { tId } = req.query
    const client = new ToornamentClient()
    const participants = await client.getParticipants(tId as string)
    res.status(200).json({ participants })
}