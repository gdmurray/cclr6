import { NextApiRequest, NextApiResponse } from 'next'
import firebaseAdmin from '@lib/firebase/admin'
import { defaultLocals, sendMail } from '@lib/platform/mail'
import { getHostName } from '../team/invite'
import * as path from 'path'
import { getEmail } from '@lib/platform/dev-mail'


export default async function(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email: emailAddress } = req.body
        try {
            await sendMail(req, emailAddress, 'verify', {})
            res.status(200).json({ status: 'success', message: 'Queue\'d up email' })
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