import { NextApiRequest, NextApiResponse } from 'next'
import authenticate, { isAdmin } from '@lib/api/authenticate'
import { Teams } from '@lib/models/team'
import { adminFireStore } from '@lib/firebase/admin'

export default async function deleteTeam(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }
    const user = await authenticate(req, res)
    const isAdministrator = await isAdmin(user, res)
    if (!isAdministrator) {
        return res.status(400).end()
    }

    const { team_id } = req.body

    const team = await Teams.getTeamById(team_id)
    if (team == null) {
        return res.status(404).end()
    }

    await adminFireStore.collection('teams').doc(team_id).delete()
    return res.status(200).end()
}
