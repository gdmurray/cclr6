import { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '@lib/platform/mail'


export default async function(req: NextApiRequest, res: NextApiResponse) {
    sendMail(req, 'gd-murray@hotmail.com', 'verify', {
        cta_url: 'https://mibr.gg'
    })
    res.status(200)
}