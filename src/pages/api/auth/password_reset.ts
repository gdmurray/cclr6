import { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@lib/firebase/admin'
import { defaultLocals, sendMail } from '@lib/platform/mail'
import { getHostName } from '../team/invite'


export default async function(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email: emailAddress } = req.body
        try {
            console.log('About to send mail')
            await sendMail(req, emailAddress, 'forgot_password', {})
            res.status(200).json({ status: 'success', message: 'Queue\'d up email' })
        } catch (err) {
            const { code, message } = err
            if (code === 'auth/internal-error') {
                res.status(400).json({ status: 'error', message, code })
            }
        }
    } else {
        res.status(405).end()
    }
}