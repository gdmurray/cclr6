import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@lib/api/authenticate'
import dayjs from 'dayjs'
import { adminFireStore } from '@lib/firebase/admin'
import { Transfer } from '@lib/models/transfer'
import { Teams } from '@lib/models/team'
import { sendMail } from '@lib/platform/mail'

export default async function acceptTransfer(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        const user = await authenticate(req, res)
        if (user) {
            const { transfer_id } = req.body
            const token = await adminFireStore.collection('transfers').doc(transfer_id).get()
            if (token.exists) {
                const data = { id: token.id, ...token.data() } as Transfer
                const { expires, team_id } = data
                const team = await adminFireStore.collection('teams').doc(team_id).get()
                if (!team.exists) {
                    res.status(400).end()
                }
                const expired = dayjs() >= dayjs(expires)
                // Expired
                if (expired) {
                    res.status(400).end()
                }

                // Invalid
                if (data.status !== 'PENDING') {
                    res.status(400).end()
                }

                // Not for you
                if (data.email_address != user.email) {
                    res.status(400).end()
                }

                // Good to go?
                // Check existing ownership
                const contactEmail = team.data().contact_email

                const previousTeam = await Teams.getTeamByOwnerID(user.uid)
                if (previousTeam) {
                    await adminFireStore.collection('teams').doc(previousTeam.id).update({ owner: null })
                }

                await adminFireStore.collection('teams').doc(team_id).update({ owner: user.uid })
                await adminFireStore.collection('transfers').doc(transfer_id).update({ status: 'ACCEPTED' })

                await sendMail(contactEmail, 'transfer_success', {
                    team_name: team.data().name,
                    user_email: user.email,
                })

                res.status(200).json({ message: 'Successfully transferred ownership' })
            } else {
                res.status(401).end()
            }
        } else {
            res.status(405).end()
        }
    }
}
