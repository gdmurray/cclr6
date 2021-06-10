import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@lib/api/authenticate'
import { Teams } from '@lib/models/team'
import { adminFireStore } from '@lib/firebase/admin'

export default async function update(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const user = await authenticate(req, res)
        const team = await Teams.getTeamByOwnerID(user.uid)
        const { team_id, settings } = req.body
        if (team && team.id === team_id) {
            const data = await adminFireStore
                .collection('teams')
                .doc(team_id)
                .update({ notification_settings: settings })

            // console.log(data)
            res.status(200).json({ status: 'success' })
        } else {
            res.status(401).end()
        }
    } else {
        res.status(405).end()
    }
}
