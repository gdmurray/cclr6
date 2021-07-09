import { Match, Round } from '@lib/models/toornament'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs'

dayjs.extend(utc)
dayjs.extend(timezone)

interface BaseSeason {
    TITLE: string
    BASE_URL: string
    TOURNAMENT_ID: string
    STAGE_ID: string
}

export interface ISeason extends BaseSeason {
    BASE_MATCH: Date
}

export const SeasonOne: ISeason = {
    TITLE: 'CCL Season One',
    BASE_URL: '/seasons/one',
    TOURNAMENT_ID: '4585711997166354432',
    STAGE_ID: '4753738149735563264',
    BASE_MATCH: new Date(Date.UTC(2021, 6, 10, 18, 0, 0)),
}

export const Seasons: Record<string, ISeason> = {
    one: SeasonOne,
}

export function getGameDate({ base, match, week }: { base: Date; match: number; week: number }): dayjs.Dayjs {
    const dayDelta = match > 2 ? 1 : 0
    const hourDelta = match % 2 == 1 ? 0 : 2
    return dayjs(base)
        .add(week - 1, 'week')
        .add(dayDelta, 'day')
        .add(hourDelta, 'hour')
}

export interface MatchWithDate extends Match {
    match_date: string
}

export interface MatchData extends Round {
    matches: MatchWithDate[]
}

export function getCurrentSeason(params: { season: string }): ISeason {
    return Seasons[params.season]
}

export function getSeasonPaths(extension: string): string[] {
    return Object.keys(Seasons).map((season) => `/seasons/${season}/${extension}`)
}
