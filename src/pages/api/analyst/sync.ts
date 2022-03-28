import { NextApiRequest, NextApiResponse } from 'next'
import authenticate, { isAnalyst } from '@lib/api/authenticate'
import { adminFireStore } from '@lib/firebase/admin'
import { updateStatSheets } from '@lib/sheets/stats'
import { MatchStatsSchema } from '@components/analyst/match/use-match-form'
import { ITeam } from '@lib/models/team'

export default async function sync(req: NextApiRequest, res: NextApiResponse) {
    const user = await authenticate(req, res)
    const isAnalystUser = await isAnalyst(user, res)
    if (isAnalystUser) {
        const { id } = req.body
        console.log('ID: ', id)
        const stats = await adminFireStore.collection('matchStats').doc(id).get()
        if (!stats.exists) {
            return res.status(404).end()
        }
        const matchStats = stats.data() as MatchStatsSchema
        console.log(matchStats)
        const teamOne = await adminFireStore.collection('teams').doc(matchStats.team_one_id).get()
        const teamTwo = await adminFireStore.collection('teams').doc(matchStats.team_two_id).get()
        // console.log(teamOne, teamTwo)
        if (!teamOne.exists || !teamTwo.exists) {
            return res.status(404).end()
        }
        try {
            await updateStatSheets(matchStats, teamOne.data() as ITeam, teamTwo.data() as ITeam)
        } catch (err) {
            console.log('Error updating stats sheet: ', err)
        }
        res.status(200).end()
    } else {
        res.status(401).end()
    }
}
