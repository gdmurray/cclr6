import { NextApiRequest, NextApiResponse } from 'next'
import authenticate, { isAdmin } from '@lib/api/authenticate'
import { adminFireStore } from '@lib/firebase/admin'
import dayjs from 'dayjs'
import { sendMail } from '@lib/platform/mail'

export default async function create(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }
    const user = await authenticate(req, res)
    const verifyAdmin = await isAdmin(user, res)
    if (!verifyAdmin) {
        return res.status(401).end()
    }
    const { team_id, payment_url, email_address, season, amount } = req.body
    console.log(team_id)
    const body = {
        payment: {
            create_time: dayjs().toISOString(),
            status: 'COMPLETED',
            payer: {
                email_address: email_address,
                payer_id: user.uid,
            },
            links: [
                {
                    href: payment_url,
                },
            ],
            purchase_units: [
                {
                    amount: {
                        currency_code: 'CAD',
                        value: amount,
                    },
                },
            ],
        },
        season: season,
        type: 'MANUAL',
    }
    await adminFireStore.collection('teams').doc(team_id).collection('payments').add(body)
    const team = await adminFireStore.collection('teams').doc(team_id).get()
    if (team.data().notification_settings?.payment !== false) {
        console.log('Can Send to team')
        await sendMail(team.data().contact_email, 'payment_success', {
            event_name: 'CCL Season 2 Qualifiers',
            cta_url: 'https://cclr6.com/team/registration',
        })
    }
    res.status(200).end()
}
