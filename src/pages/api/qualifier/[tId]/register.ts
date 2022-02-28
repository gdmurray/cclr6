import { NextApiRequest, NextApiResponse } from 'next'
import { adminFireStore } from '@lib/firebase/admin'
import authenticate from '@lib/api/authenticate'
import { CreateTeamClient, Teams } from '@lib/models/team'
import { IPlayer } from '@lib/models/player'
import { sendMail } from '@lib/platform/mail'
import { dispatchTask, RegistrationTaskType } from '@lib/platform/dispatchTask'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const user = await authenticate(req, res)
        const { team_id, event_name } = req.body
        const {
            query: { tId: qualifierId },
        } = req as { query: { [key: string]: string } }

        const team = await Teams.getTeamByUserID(user.uid)
        if (team.id !== team_id) {
            res.status(403).end()
            return
        }
        const teamClient = CreateTeamClient(team, adminFireStore)
        const hasRegistered = await teamClient.hasTeamRegistered(qualifierId)

        if (!hasRegistered) {
            await teamClient.registerForTournament(qualifierId, '')
            const players = await adminFireStore.collection('teams').doc(team.id).collection('players').get()
            const playerData = players.docs.map((player) => ({
                id: player.id,
                ...(player.data() as IPlayer),
            }))
            console.log('Has Paid for: ', qualifierId, await teamClient.hasPaidForQualifier(qualifierId))
            await dispatchTask({
                type: RegistrationTaskType.TEAM_REGISTER,
                event: qualifierId,
                team: {
                    id: team.id,
                    name: team.name,
                    contact_email: team.contact_email,
                    paid: true,
                    registered: true,
                },
                players: playerData,
            })
            if (teamClient.canSendNotification('registration')) {
                await sendMail(team.contact_email, 'registration', {
                    event_name: event_name,
                    cta_url: `https://www.toornament.com/en_US/tournaments/${qualifierId}/information`,
                })
            }

            res.status(200).json({ status: 'success', message: 'registered' })
        } else {
            res.status(400).json({ status: 'failure', message: 'already registered' })
        }
    } else {
        res.status(405).end()
    }
}
