import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@lib/api/authenticate'
import { CreateTeamClient, Teams } from '@lib/models/team'
import { ToornamentClient } from '@lib/api/toornament'
import getTeamRegistrations from '@lib/api/getTeamRegistrations'
import { countryMapping } from '@lib/utils'


export default async function(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const user = await authenticate(req, res)
        const team = await Teams.getTeamByUserID(user.uid)
        if (team) {
            const activeRegistrations = await getTeamRegistrations(team)
            if (activeRegistrations.length > 0) {
                const [active] = activeRegistrations
                const { participant_id, tournament_id } = active

                const data = JSON.parse(req.body)
                const playerData = data.map((player) => ({
                    name: player.uplay,
                    custom_user_identifier: player.id,
                    email: player.email,
                    custom_fields: {
                        country: countryMapping[player.country],
                        uplay: player.uplay
                    }
                }))

                const body = {
                    name: team.name,
                    email: team.contact_email,
                    custom_user_identifier: team.id,
                    checked_in: true,
                    lineup: playerData
                }
                console.log('body: ', body)
                const client = new ToornamentClient()
                await client.updateParticipant(participant_id, body)
            }
        }
        res.status(200).end()

    } else {
        res.status(405)
    }
}