import { CreateTeamClient, ITeam } from '@lib/models/team'
import { adminFireStore } from '@lib/firebase/admin'
import { ToornamentClient } from '@lib/api/toornament'

// todo: I NEED TO DO TWO DIFFERENT THINGS. 1: IS THERE AN ACTIVE TOURNAMENT ONGOING, 2: WHAT IS THE NEXT TOURNAMENT?
export default async function getTeamRegistrations(team: ITeam) {
    const teamClient = CreateTeamClient(team, adminFireStore)
    const registrations = await teamClient.getRegistrations()
    const client = new ToornamentClient()
    const tournaments = await client.getTournaments('status=pending')
    // Filters all team registrations
    const activeRegistrations = registrations.map((reg) => {
        const filteredTournament = tournaments.filter((tournament) => tournament.id === reg.tournament_id)
        if (filteredTournament.length === 1)
            return ({
                ...reg,
                tournament: {
                    ...filteredTournament[0]
                }
            })
        return undefined
    }).filter((reg) => reg !== undefined)
    return activeRegistrations
}