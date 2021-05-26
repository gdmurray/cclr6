import { NextApiRequest, NextApiResponse } from 'next'
import firebaseAdmin from '@lib/firebase/admin'

export default async function authenticate(req: NextApiRequest, res: NextApiResponse) {
    const authToken = req.cookies.token
    const user = await firebaseAdmin.auth().verifyIdToken(authToken)
    if (user) {
        return user
    } else {
        res.status(403).end()
    }
}