import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@lib/api/authenticate'
import { Teams } from '@lib/models/team'
import dayjs from 'dayjs'
import getTeamRegistrations from '@lib/api/getTeamRegistrations'


// TODO: ADD A FILTER IF THE TEAM HAS QUALIFIED... DO THIS FOR THE NEXT ONE!
export default async function locked(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const user = await authenticate(req, res)
        const team = await Teams.getTeamByUserID(user.uid)
        const activeRegistrations = await getTeamRegistrations(team)
        let response = {}
        if (activeRegistrations.length > 0) {
            const [active] = activeRegistrations
            if (dayjs(active.tournament.registration_closing_datetime).diff(dayjs(), 'minutes') < 30) {
                response = {
                    status: 'locked',
                    message: 'Roster window closed during qualifier'
                }
            }
        } else {
            response = {
                status: 'unlocked',
                message: ''
            }
        }
        res.status(200).json({ ...response })

    } else {
        return res.status(405).end()
    }

}