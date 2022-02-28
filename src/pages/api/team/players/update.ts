import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@lib/api/authenticate'
import { CreateTeamClient, Teams } from '@lib/models/team'
import { adminFireStore } from '@lib/firebase/admin'
import { dispatchTask, RegistrationTaskType } from '@lib/platform/dispatchTask'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const user = await authenticate(req, res)
        const team = await Teams.getTeamByUserID(user.uid)
        const teamClient = CreateTeamClient(team, adminFireStore)
        if (!team) {
            res.status(404).end()
        }
        const data = JSON.parse(req.body)
        const registrations = await teamClient.getRegistrations()
        if (registrations.length === 0) {
            res.status(200).end()
        }
        for (const registration of registrations.filter((elem) => elem.tournament_id.startsWith('s2p1'))) {
            await dispatchTask({
                type: RegistrationTaskType.PLAYER_UPDATE,
                event: registration.tournament_id,
                team: {
                    id: team.id,
                },
                players: data.filter((elem) => elem.id != ''),
            })
        }
        res.status(201).end()
    } else {
        res.status(405)
    }
}
