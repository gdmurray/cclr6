import { NextApiRequest, NextApiResponse } from 'next'
import firebaseAdmin from '@lib/firebase/admin'
import { defaultLocals, sendMail } from '@lib/platform/mail'
import { getHostName } from '../team/invite'


export default async function(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email: emailAddress } = req.body
        try {
            console.log('Generating password reset link')
            // const link = await firebaseAdmin.auth().generatePasswordResetLink(emailAddress, {
            //     url: `${getHostName()}/login`
            // })
            const link = 'https://cclr6.com/pain/agony/even'
            console.log('GENERATED LINK: ', link)
            if (link) {
                console.log('About to send mail')
                await sendMail(req, emailAddress, 'forgot_password', {
                    cta_url: link
                })
                res.status(200).json({ status: 'success', message: 'Queue\'d up email' })
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