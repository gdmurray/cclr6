import { Match, Round } from '@lib/models/toornament'
import { ToornamentClient } from '@lib/api/toornament'
import { Season, MatchData, Seasons } from '@lib/season/common'
import { bucket } from '@lib/api/cms'
import { adminFireStore } from '@lib/firebase/admin'
import dayjs from 'dayjs'
import { ITeam } from '@lib/models/team'
import { getMatchDate } from '@components/analyst/match/utils'

export async function getMatchData(matches: Match[], season: Season): Promise<MatchData[]> {
    const client = new ToornamentClient()
    const rounds: Round[] = await client.getRounds(season.STAGE_ID)

    const roundMap = matches.reduce((acc, value) => {
        if (value.round_id in acc) {
            acc[value.round_id].push(value)
        } else {
            acc[value.round_id] = [value]
        }
        return acc
    }, {})

    const matchData: MatchData[] = rounds.map((round) => {
        return {
            ...round,
            matches: roundMap[round.id],
        }
    })

    for (let i = 0; i < matchData.length; i += 1) {
        if (matchData[i].matches != null) {
            for (let j = 0; j < matchData[i].matches.length; j += 1) {
                const match = matchData[i].matches[j]
                const gameDate = dayjs(getMatchDate(match))
                matchData[i].matches[j].match_date = gameDate.toISOString()
            }
        }
    }
    return matchData
}

export async function getAllSeasonHomes() {
    const params = {
        type: 'season-homes',
        props: 'slug,title,metadata,created_at,content',
        sort: '-created_at',
    }
    const data = await bucket.getObjects(params)
    return data.objects
}

export async function getSeasonHome(season: string) {
    const result = await bucket
        .getObjects({
            query: {
                type: 'season-homes',
                slug: season,
            },
            props: 'slug,title,content,metadata,created_at',
        })
        .catch((error) => {
            if (error.status === 404) {
                return
            }
            throw error
        })

    if (!result) {
        return {
            page: undefined,
        }
    }

    const [page] = result.objects

    return {
        page,
    }
}

export async function getIdToSlugMap(season) {
    const slugs = await adminFireStore.collection('season').doc(season).collection('teams').get()
    return slugs.docs.reduce((acc, elem) => {
        const data = elem.data()
        acc[data.team_id] = data.slug
        return acc
    }, {})
}

export async function getSeasonTeamsUrls() {
    let paths = []
    const teams = await adminFireStore.collection('teams').get()

    const teamMap = teams.docs.reduce((acc: Record<string, Partial<ITeam>>, team) => {
        acc[team.id] = team
        return acc
    }, {})

    for (const season of Object.keys(Seasons)) {
        const seasonObject = Seasons[season]
        const registrations = await adminFireStore
            .collectionGroup('registrations')
            .where('tournament_id', '==', seasonObject.id)
            .get()

        const registeredTeams = registrations.docs.map((doc) => doc.ref.path.split('/')[1])
        const slugs = registeredTeams.map(
            (team) => `/seasons/${season}/teams/${teamMap[team].slug ?? teamMap[team].id}`
        )
        paths = paths.concat(slugs)
    }
    return paths
}

export async function getSeasonTeams(season) {
    const seasonTeams = await adminFireStore.collection('season').doc(season).collection('teams').get()
    const teams = await adminFireStore.collection('teams').get()
    const teamIdMap = teams.docs.reduce((acc, val) => {
        acc[val.id] = {
            id: val.id,
            ...val.data(),
        }
        return acc
    }, {})

    return seasonTeams.docs.reduce((acc, val) => {
        const data = val.data()
        acc[data.team_id] = teamIdMap[data.team_id]
        return acc
    }, {})
}
