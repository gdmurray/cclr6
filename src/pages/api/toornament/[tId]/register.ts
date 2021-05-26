import { NextApiRequest, NextApiResponse } from 'next'
import { adminFireStore } from '@lib/firebase/admin'
import authenticate from '@lib/api/authenticate'
import { CreateTeamClient, Teams } from '@lib/models/team'
import { ToornamentClient } from '@lib/api/toornament'
import { IPlayer } from '@lib/models/player'
import { countryMapping } from '@lib/utils'

export default async function(req: NextApiRequest, res: NextApiResponse) {
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

    if (!hasRegistered) {
        const players = await adminFireStore
            .collection('teams')
            .doc(team.id)
            .collection('players')
            .get()
        const playerData = players.docs.map((player) => ({
            id: player.id,
            ...player.data() as IPlayer
        }))
        const body = {
            name: team.name,
            email: team.contact_email,
            custom_user_identifier: team.id,
            checked_in: true,
            lineup: playerData.map((player) => ({
                name: player.uplay,
                custom_user_identifier: player.id,
                email: player.email,
                custom_fields: {
                    country: countryMapping[player.country],
                    uplay: player.uplay
                }
            }))
        }
        const participantId = await toornamentClient.registerTeam(toornamentId as string, body)
        await teamClient.registerForTournament(toornamentId as string, participantId)
        res.status(200).json({ status: 'success', message: 'registered' })
    } else {
        res.status(400).json({ status: 'failure', message: 'already registered' })
    }

}