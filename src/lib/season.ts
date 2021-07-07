import { ToornamentClient } from '@lib/api/toornament'
import { Match, Round } from '@lib/models/toornament'
import dayjs from 'dayjs'

export const SeasonOne = {
    TOURNAMENT_ID: '4585711997166354432',
    STAGE_ID: '4753738149735563264',
    BASE_MATCH: new Date(2021, 6, 10, 14, 0, 0),
}

export function getGameDate({ base, match, week }): dayjs.Dayjs {
    const dayDelta = match > 1 ? 0 : 1
    return dayjs(base)
        .add(week - 1, 'week')
        .add(dayDelta, 'day')
}

export interface MatchWithDate extends Match {
    match_date: string
}

export interface MatchData extends Round {
    matches: MatchWithDate[]
}

export async function getMatchData(matches: Match[], base_match: Date): Promise<MatchData[]> {
    const client = new ToornamentClient()
    const rounds: Round[] = await client.getRounds(SeasonOne.STAGE_ID)

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
        const round = matchData[i]
        for (let j = 0; j < matchData[i].matches.length; j += 1) {
            const match = matchData[i].matches[j]
            matchData[i].matches[j].match_date = getGameDate({
                match: match.number,
                week: round.number,
                base: base_match,
            }).toISOString()
        }
    }

    return matchData
}
