import { NextApiRequest, NextApiResponse } from 'next'
import authenticate, { isAdmin } from '@lib/api/authenticate'
import { adminFireStore } from '@lib/firebase/admin'
import { countryMapping } from '@lib/utils'
import { ITeam, Teams } from '@lib/models/team'
import { ToornamentClient } from '@lib/api/toornament'

export default async function sync(req: NextApiRequest, res: NextApiResponse) {
    const user = await authenticate(req, res)
    const isAdministrator = await isAdmin(user, res)
    if (isAdministrator) {
        const { team_id, tournament_id, participant_id } = req.body
        console.log(team_id, tournament_id, participant_id)
        const teamData = await adminFireStore.collection('teams').doc(team_id).get()
        const team = { id: teamData.id, ...teamData.data() } as ITeam
        console.log('Team: ', team)
        const players = await adminFireStore.collection('teams').doc(team_id).collection('players').get()
        const playerData = players.docs.map((elem) => {
            const player = elem.data()
            return {
                name: player.uplay,
                custom_user_identifier: elem.id,
                email: player.email,
                custom_fields: {
                    country: countryMapping[player.country],
                    uplay: player.uplay,
                },
            }
        })

        const body = {
            name: team.name,
            email: team.contact_email,
            custom_user_identifier: team_id,
            checked_in: true,
            lineup: playerData,
        }
        const client = new ToornamentClient()
        await client.updateParticipant(participant_id, body)

        await adminFireStore.collection('season').doc('one').collection('teams').add({
            team_id: team.id,
            participant_id: participant_id,
            team_name: team.name,
        })
        res.status(200).end()
    } else {
        res.status(401).end()
    }
}
