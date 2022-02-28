import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@lib/api/authenticate'
import { CreateTeamClient, Teams } from '@lib/models/team'
import { adminFireStore } from '@lib/firebase/admin'
import { dispatchTask, RegistrationTaskType } from '@lib/platform/dispatchTask'
import { IPlayer } from '@lib/models/player'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const user = await authenticate(req, res)
        const team = await Teams.getTeamByUserID(user.uid)
        const teamClient = CreateTeamClient(team, adminFireStore)
        if (team == null) {
            res.status(404).end()
        }
        const data = req.body

        const registrations = await teamClient.getRegistrations()

        if (registrations.length === 0) {
            res.status(200).end()
        }
        const players = await adminFireStore.collection('teams').doc(team.id).collection('players').get()
        const playerData = players.docs.map((player) => ({
            id: player.id,
            ...(player.data() as IPlayer),
        }))
        for (const registration of registrations.filter((elem) => elem.tournament_id.startsWith('s2p1'))) {
            console.log('Paid for qualifier: ', teamClient.hasPaidForQualifier(registration.tournament_id))
            await dispatchTask({
                type: RegistrationTaskType.TEAM_UPDATE,
                event: registration.tournament_id,
                team: {
                    id: team.id,
                    name: data.name,
                    contact_email: data.contact_email,
                    paid: true,
                    registered: true,
                },
                players: playerData,
            })
        }
        res.status(201).end()
    } else {
        res.status(405)
    }
}
