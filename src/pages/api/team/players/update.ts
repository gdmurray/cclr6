import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@lib/api/authenticate'
import { Teams } from '@lib/models/team'
import { ToornamentClient } from '@lib/api/toornament'
import { getActiveParticipantIds } from '@lib/api/getTeamRegistrations'
import { countryMapping } from '@lib/utils'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const user = await authenticate(req, res)
        const team = await Teams.getTeamByUserID(user.uid)
        if (team) {
            const participant_ids = await getActiveParticipantIds(team)
            const data = JSON.parse(req.body)
            const playerData = data.map((player) => ({
                name: player.uplay,
                custom_user_identifier: player.id,
                email: player.email,
                custom_fields: {
                    country: countryMapping[player.country],
                    uplay: player.uplay,
                },
            }))

            const body = {
                name: team.name,
                email: team.contact_email,
                custom_user_identifier: team.id,
                checked_in: true,
                lineup: playerData,
            }
            console.log('body: ', body)
            const client = new ToornamentClient()
            for (let i = 0; i < participant_ids.length; i += 1) {
                const pid = participant_ids[i]
                await client.updateParticipant(pid, body)
            }
        }
        res.status(200).end()
    } else {
        res.status(405)
    }
}
