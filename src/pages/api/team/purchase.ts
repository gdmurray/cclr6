import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@lib/api/authenticate'
import { CreateTeamClient, ITeam, Teams } from '@lib/models/team'
import { adminFireStore } from '@lib/firebase/admin'
import { sendMail } from '@lib/platform/mail'

export default async function purchase(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const user = await authenticate(req, res)
        const { team_id } = req.body
        const getTeam = await Teams.getTeamByOwnerID(user.uid)
        if (getTeam && getTeam.id === team_id) {
            const team = { id: getTeam.id, ...getTeam.data() } as ITeam
            const teamClient = CreateTeamClient(team, adminFireStore)
            if (teamClient.canSendNotification('payment')) {
                await sendMail(user.email, 'payment_success', {
                    event_name: 'CCL Season 1 Qualifiers',
                    cta_url: 'https://cclr6.com/team/registration',
                })
            }
            res.status(200).end()
        } else {
            res.status(401).end()
        }
    } else {
        res.status(405).end()
    }
}
