import { NextApiRequest, NextApiResponse } from 'next'
import firebaseAdmin, { FieldValue, adminFireStore } from '@lib/firebase-admin'


export default async function(req: NextApiRequest, res: NextApiResponse) {
    const { id, team_id, user_id, user_email } = req.body
    try {
        const authToken = req.cookies.token
        const user = await firebaseAdmin.auth().verifyIdToken(authToken)
        if (user && user.email === user_email && user_id === user.uid) {
            await adminFireStore.collection('teams').doc(team_id).update({
                players: FieldValue.arrayUnion(user_id)
            })
            await adminFireStore.collection("invitations").doc(id).update({
                status: "ACCEPTED"
            })
            res.status(200).end()
        } else {
            res.status(403).end()
        }
    } catch (e) {
        res.status(403).end()
    }
}