import { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '@lib/platform/mail'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email: emailAddress } = req.body
        try {
            await sendMail(emailAddress, 'verify', {})
            res.status(200).json({ status: 'success', message: "Queue'd up email" })
        } catch (err) {
            const { code } = err
            if (code === 'auth/internal-error') {
                res.status(400).json({ status: 'error', message: 'Email not found' })
            }
        }
    } else {
        res.status(405).end()
    }
}
