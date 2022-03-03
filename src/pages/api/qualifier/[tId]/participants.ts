import { NextApiRequest, NextApiResponse } from 'next'
import { CreateSeasonClient } from '@lib/models/season'
import { adminFireStore } from '@lib/firebase/admin'

export default async function participants(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    const { tId, team_data } = req.query
    const seasonClient = CreateSeasonClient(adminFireStore)
    const getTeamData = team_data == undefined ? false : team_data === 'true'
    const participants = await seasonClient.getRegisteredTeams(tId as string, getTeamData)
    res.status(200).json({ participants })
}
