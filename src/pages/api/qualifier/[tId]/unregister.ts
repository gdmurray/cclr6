import { NextApiRequest, NextApiResponse } from 'next'
import { adminFireStore } from '@lib/firebase/admin'
import authenticate from '@lib/api/authenticate'
import { CreateTeamClient, IRegistration, Teams } from '@lib/models/team'
import { dispatchTask, RegistrationTaskType } from '@lib/platform/dispatchTask'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const user = await authenticate(req, res)
        const { team_id } = req.body
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

        if (hasRegistered) {
            const { id } = hasRegistered as IRegistration
            await teamClient.unregisterForTournament(id)
            console.log('Has Paid for: ', qualifierId, await teamClient.hasPaidForQualifier(qualifierId))
            await dispatchTask({
                type: RegistrationTaskType.TEAM_UNREGISTER,
                event: qualifierId,
                team: {
                    id: team.id,
                    name: team.name,
                    contact_email: team.contact_email,
                    paid: true,
                    registered: false,
                },
                players: [],
            })
            // await teamClient.registerForTournament(toornamentId as string, participantId)
            // await sendMail( team.contact_email, 'registration', {
            //     cta_url: `https://www.toornament.com/en_US/tournaments/${toornamentId}/information`
            // })
            res.status(200).json({ status: 'success', message: 'unregistered' })
        } else {
            res.status(400).json({ status: 'failure', message: 'already not registered' })
        }
    } else {
        res.status(405).end()
    }
}
