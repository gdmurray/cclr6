import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@lib/api/authenticate'
import { Teams } from '@lib/models/team'
import { adminFireStore } from '@lib/firebase/admin'


export default async function payments(req: NextApiRequest, res: NextApiResponse) {
    const user = await authenticate(req, res)
    const team = await Teams.getTeamByOwnerID(user.uid)
    if (team) {
        const payments = await adminFireStore
            .collection('teams')
            .doc(team.id)
            .collection('payments')
            .get()
        const paymentData = payments.docs.map((payment) => ({ id: payment.id, ...payment.data() }))
        res.status(200).json({ payments: paymentData })
    } else {
        res.status(401).end()
    }
}