import { NextApiRequest, NextApiResponse } from 'next'
import authenticate, { isAnalyst } from '@lib/api/authenticate'
import { adminFireStore } from '@lib/firebase/admin'

export default async function update(req: NextApiRequest, res: NextApiResponse) {
    const user = await authenticate(req, res)
    const isAnalystUser = await isAnalyst(user, res)
    if (isAnalystUser) {
        const { stats } = req.body
        if ('id' in stats) {
            const copiedStats = { ...stats }
            const { id } = copiedStats
            delete stats.id
            await adminFireStore
                .collection('matchStats')
                .doc(id)
                .update({ ...stats })
            res.status(200).json({ id: id })
        } else {
            const created = await adminFireStore.collection('matchStats').add({ ...stats })
            res.status(200).json({ id: created.id })
        }
    } else {
        res.status(401).end()
    }
}
