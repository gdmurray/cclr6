import { NextApiRequest, NextApiResponse } from 'next'
import authenticate, { isAdmin } from '@lib/api/authenticate'
import { sendMail } from '@lib/platform/mail'

export default async function email(req: NextApiRequest, res: NextApiResponse) {
    const user = await authenticate(req, res)
    const verifyAdmin = await isAdmin(user, res)
    if (user && verifyAdmin) {
        const { template, variables } = req.body
        await sendMail(user.email, template, variables)
        res.status(200).end()
    } else {
        res.status(403).end()
    }
}
