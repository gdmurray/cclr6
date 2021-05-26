import { NextApiRequest, NextApiResponse } from 'next'
import firebaseAdmin from '@lib/firebase/admin'
import { defaultLocals, getEmail } from '@lib/platform/mail'
import * as path from 'path'
import { getHostName } from '../team/invite'


export default async function(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email: emailAddress } = req.body
        try {
            const link = await firebaseAdmin.auth().generateEmailVerificationLink(emailAddress, {
                url: `${getHostName()}`
            })
            if (link) {
                const email = getEmail()
                email.send({
                    template: path.resolve('src/email/verify'),
                    message: {
                        to: emailAddress
                    },
                    locals: {
                        ...defaultLocals,
                        cta_url: link
                    }
                })
                res.status(200).end()
            }
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