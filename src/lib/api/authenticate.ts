import { NextApiRequest, NextApiResponse } from 'next'
import firebaseAdmin, { adminFireStore } from '@lib/firebase/admin'

export default async function authenticate(req: NextApiRequest, res: NextApiResponse) {
    const authToken = req.cookies.token
    const user = await firebaseAdmin.auth().verifyIdToken(authToken)
    if (user) {
        return user
    } else {
        res.status(403).end()
    }
}

export async function isAdmin(user: firebaseAdmin.auth.DecodedIdToken, res: NextApiResponse) {
    const adminQuery = await adminFireStore.collection('admins').where('user', '==', user.uid).get()
    if (adminQuery.empty) {
        res.status(403).end()
    } else {
        return true
    }
}

export async function isAnalyst(user: firebaseAdmin.auth.DecodedIdToken, res: NextApiResponse) {
    const analystQuery = await adminFireStore.collection('analysts').where('user', '==', user.uid).get()
    if (analystQuery.empty) {
        res.status(403).end()
    } else {
        return true
    }
}
