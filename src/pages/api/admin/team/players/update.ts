import { NextApiRequest, NextApiResponse } from 'next'
import authenticate, { isAdmin } from '@lib/api/authenticate'
import { IPlayer } from '@lib/models/player'
import { adminFireStore } from '@lib/firebase/admin'
import { countryMapping } from '@lib/utils'
import { ToornamentClient } from '@lib/api/toornament'
import { getActiveParticipantIds } from '@lib/api/getTeamRegistrations'
import { upsertPlayer } from '@lib/api/upsertPlayer'

interface TransactionResult {
    player: IPlayer
    status: 'CREATED' | 'UPDATED' | 'REMOVED'
}

export default async function update(req: NextApiRequest, res: NextApiResponse) {
    const user = await authenticate(req, res)
    const isAdministrator = await isAdmin(user, res)
    if (isAdministrator) {
        const { team_id, players } = req.body
        const ref = adminFireStore.collection('teams').doc(team_id)
        await Promise.all<TransactionResult>(players.map((player) => upsertPlayer(ref, player)))
        const participant_ids = await getActiveParticipantIds(team_id)
        if (participant_ids.length > 0) {
            const playerCollection = await adminFireStore.collection('teams').doc(team_id).collection('players').get()
            const playerData = playerCollection.docs.map((elem) => {
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
                lineup: playerData,
            }

            const client = new ToornamentClient()
            for (let i = 0; i < participant_ids.length; i += 1) {
                const pid = participant_ids[i]
                await client.updateParticipant(pid, body)
            }
        }
        res.status(200).end()
    } else {
        res.status(401).end()
    }
}
