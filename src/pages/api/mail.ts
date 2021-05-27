import { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '@lib/platform/mail'


export default async function(req: NextApiRequest, res: NextApiResponse) {
    await sendMail(req, 'gd-murray@hotmail.com', 'verify', {
        cta_url: 'https://mibr.gg'
    })
    res.status(200).json({ message: 'Queued that email' })
}