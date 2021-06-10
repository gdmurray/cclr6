import { NextApiRequest, NextApiResponse } from 'next'
import authenticate, { isAdmin } from '@lib/api/authenticate'
import { adminFireStore } from '@lib/firebase/admin'
import dayjs from 'dayjs'
import { sendMail } from '@lib/platform/mail'

export default async function create(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const user = await authenticate(req, res)
        const verifyAdmin = await isAdmin(user, res)
        if (verifyAdmin) {
            const { team_id, payment_url, email_address } = req.body
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
                                value: '40.00',
                            },
                        },
                    ],
                },
                season: '1',
                type: 'MANUAL',
            }
            await adminFireStore.collection('teams').doc(team_id).collection('payments').add(body)
            const team = await adminFireStore.collection('teams').doc(team_id).get()
            if (team.data().notification_settings?.payment !== false) {
                console.log('Can Send to team')
                await sendMail(team.data().contact_email, 'payment_success', {
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
