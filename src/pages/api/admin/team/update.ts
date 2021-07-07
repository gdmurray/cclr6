import { NextApiRequest, NextApiResponse } from 'next'
import authenticate, { isAdmin } from '@lib/api/authenticate'
import { adminFireStore } from '@lib/firebase/admin'
import { getActiveParticipantIds } from '@lib/api/getTeamRegistrations'
import { ToornamentClient } from '@lib/api/toornament'

export default async function update(req: NextApiRequest, res: NextApiResponse) {
    const user = await authenticate(req, res)
    const isAdministrator = await isAdmin(user, res)
    if (isAdministrator) {
        const { team_id, values } = req.body
        await adminFireStore
            .collection('teams')
            .doc(team_id)
            .update({
                ...values,
            })
        const participant_ids = await getActiveParticipantIds(team_id)
        const body = {
            name: values.name,
        }
        const client = new ToornamentClient()
        for (let i = 0; i < participant_ids.length; i += 1) {
            const pid = participant_ids[i]
            await client.updateParticipant(pid, body)
        }
        res.status(200).end()
    } else {
        res.status(401).end()
    }
}
