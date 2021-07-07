import { CreateTeamClient, ITeam } from '@lib/models/team'
import { adminFireStore } from '@lib/firebase/admin'
import { ToornamentClient } from '@lib/api/toornament'
import dayjs from 'dayjs'

// todo: I NEED TO DO TWO DIFFERENT THINGS. 1: IS THERE AN ACTIVE TOURNAMENT ONGOING, 2: WHAT IS THE NEXT TOURNAMENT?
export default async function getTeamRegistrations(team: ITeam) {
    const teamClient = CreateTeamClient(team, adminFireStore)
    const registrations = await teamClient.getRegistrations()
    const client = new ToornamentClient()
    const tournaments = await client.getTournaments('status=pending')
    // Filters all team registrations
    const activeRegistrations = registrations
        .map((reg) => {
            const filteredTournament = tournaments.filter((tournament) => tournament.id === reg.tournament_id)
            if (filteredTournament.length === 1)
                return {
                    ...reg,
                    tournament: {
                        ...filteredTournament[0],
                    },
                }
            return undefined
        })
        .filter((reg) => reg !== undefined)
    return activeRegistrations
}

export async function getTeam(team_data: ITeam | string): Promise<ITeam> {
    if (typeof team_data === 'string') {
        const teamData = await adminFireStore.collection('teams').doc(team_data).get()
        const team = { id: teamData.id, ...teamData.data() } as ITeam
        return Promise.resolve(team)
    }
    return Promise.resolve(team_data)
}

export async function getActiveParticipantIds(team_data: ITeam | string) {
    const team = await getTeam(team_data)
    const activeRegistrations = await getTeamRegistrations(team)
    const filteredRegistrations = activeRegistrations.filter(
        (reg) => dayjs() <= dayjs(reg.tournament.scheduled_date_end)
    )
    let participant_ids = filteredRegistrations.map((elem) => {
        return elem.participant_id
    })

    const seasons = await adminFireStore
        .collection('season')
        .doc('one')
        .collection('teams')
        .where('team_id', '==', team.id)
        .get()
    const season_p_ids = seasons.docs.map((elem) => {
        return elem.data().participant_id
    })
    participant_ids = participant_ids.concat(season_p_ids)
    return Promise.resolve(participant_ids)
}
