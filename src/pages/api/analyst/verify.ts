import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@lib/api/authenticate'
import { adminFireStore } from '@lib/firebase/admin'

export default async function verifyAdmin(req: NextApiRequest, res: NextApiResponse) {
    try {
        const user = await authenticate(req, res)
        if (user) {
            console.log(user.uid)
            const isAnalyst = await adminFireStore.collection('analysts').where('user', '==', user.uid).get()
            if (!isAnalyst.empty) {
                res.status(200).json({ status: 'success', message: 'You are an analyst' })
            } else {
                res.status(403).json({ status: 'failure', message: 'Not an analyst' })
            }
        } else {
            res.status(401).end()
        }
    } catch (err) {
        res.status(401).end()
    }
}
