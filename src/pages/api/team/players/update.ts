import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@lib/api/authenticate'
import { CreateTeamClient, Teams } from '@lib/models/team'
import { ToornamentClient } from '@lib/api/toornament'


export default async function(req: NextApiRequest, res: NextApiResponse) {
    const user = await authenticate(req, res)
    const team = await Teams.getTeamByUserID(user.uid)
    const teamClient = CreateTeamClient(team)
    const registrations = await teamClient.getRegistrations()
    const client = new ToornamentClient()
    const tournaments = await client.getTournaments('status=pending')
    const activeRegistrations = registrations.filter((registration) => {
        if (registration.status === 'REGISTERED') {
            const filteredTournaments = tournaments.filter((tournament) => tournament.id === registration.tournament_id)
            if (filteredTournaments.length === 1) {
                return true
            }
        }
        return false
    })

    if (activeRegistrations.length === 1) {

    }

    console.log(await client.getTournaments('status=pending'))

    // console.log(registrations)
}