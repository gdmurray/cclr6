import { NextApiRequest, NextApiResponse } from 'next'
import { adminFireStore } from '@lib/firebase/admin'
import authenticate from '@lib/api/authenticate'
import { CreateTeamClient, IRegistration, Teams } from '@lib/models/team'
import { ToornamentClient } from '@lib/api/toornament'
import { IPlayer } from '@lib/models/player'
import { countryMapping } from '@lib/utils'
import { sendMail } from '@lib/platform/mail'

export default async function(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const user = await authenticate(req, res)
        const { team_id } = req.body
        const { query: { tId: toornamentId } } = req

        const team = await Teams.getTeamByUserID(user.uid)
        if (team.id !== team_id) {
            res.status(403).end()
            return
        }
        const teamClient = CreateTeamClient(team, adminFireStore)
        const toornamentClient = new ToornamentClient()
        const hasRegistered = await teamClient.hasTeamRegistered(toornamentId as string)

        if (hasRegistered) {
            console.log(hasRegistered)
            console.log('HAS REGISTERED')
            const { id, participant_id } = hasRegistered as IRegistration
            await toornamentClient.unregisterTeam(participant_id)
            await teamClient.unregisterForTournament(id!)
            // await teamClient.registerForTournament(toornamentId as string, participantId)
            // await sendMail(req, team.contact_email, 'registration', {
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