import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@lib/api/authenticate'
import { Teams } from '@lib/models/team'
import getTeamRegistrations from '@lib/api/getTeamRegistrations'
import { ToornamentClient } from '@lib/api/toornament'
import { adminFireStore } from '@lib/firebase/admin'
import { IPlayer } from '@lib/models/player'
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

                const data = req.body
                console.log('DATA: ', data)

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
                    name: data.name,
                    email: data.contact_email,
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
                const client = new ToornamentClient()
                await client.updateParticipant(tournament_id, participant_id, body)
            }
        }
        res.status(200).end()

    } else {
        res.status(405)
    }
}