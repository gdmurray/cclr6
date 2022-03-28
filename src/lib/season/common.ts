import { Match, Round } from '@lib/models/toornament'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs'
import { Tournament } from '@lib/models/tournament'

dayjs.extend(utc)
dayjs.extend(timezone)

export interface Season {
    TITLE: string
    BASE_URL: string
    TOURNAMENT_ID: string
    STAGE_ID: string

    id: string
    slug: string
    active: boolean
    name: string
    short_name: string
    toornamentId: string
    start_date: string
    end_date: string
    registration_opens: string
    registration_closes: string
    qualifiers: Partial<Tournament>[]

    BASE_MATCH: Date
    MATCH_DAYS: string[]
    WEEK_FORMATTER: (week) => Match[][]
}

export const SeasonOne: Season = {
    TITLE: 'CCL Season One',
    BASE_URL: '/seasons/one',
    TOURNAMENT_ID: '4585711997166354432',
    STAGE_ID: '4753738149735563264',
    slug: 'one',
    id: '1',
    active: false,
    toornamentId: '4585711997166354432',
    start_date: '2021-07-01',
    end_date: '2021-09-01',
    registration_opens: '2021-02-22',
    registration_closes: '',
    short_name: 'Season 1',
    name: 'Canada Contenders Series: Season 1',
    qualifiers: [
        {
            id: process.env.FIREBASE_PROJECT_ID === 'ccl-content' ? '4586031971897286656' : '4657867830957891584',
        },
        {
            id: process.env.FIREBASE_PROJECT_ID === 'ccl-content' ? '4656151368065269760' : '4657870642085552128',
        },
        {
            id: '4656235654717947904',
        },
        {
            id: '4656251121246019584',
        },
    ],
    BASE_MATCH: new Date(Date.UTC(2021, 6, 10, 18, 0, 0)),
    MATCH_DAYS: ['Satur', 'Sun'],
    WEEK_FORMATTER: (week: { matches: MatchWithDate[] }[]) => {
        return week[0].matches.reduce((acc, elem, index) => {
            const remainder = index % 2
            // IS EVEN
            if (remainder === 0) {
                const len = acc.push([])
                acc[len - 1].push(elem)
            }

            // IS ODD
            if (remainder === 1) {
                acc[(index - 1) / 2].push(elem)
            }
            return acc
        }, [])
    },
}

export const SeasonTwoSplit1: Season = {
    TITLE: 'CCL Season Two',
    BASE_URL: '/seasons/one',
    TOURNAMENT_ID: '5502105625157156864',
    STAGE_ID: '5502112228531617792',

    id: 's2p1',
    slug: 'two',
    active: true,
    toornamentId: '5502105625157156864',
    start_date: '2022-03-21',
    end_date: '2022-04-15',
    registration_opens: '2022-02-28',
    registration_closes: '2022-03-12',
    short_name: 'Season 2 - Split 1',
    name: 'Canada Contenders Series: Season 2 - Split 1',
    qualifiers: [
        {
            id: 's2p1q1',
            short_name: 'Split 1 - Qualifier #1',
            name: 'CCL: S2 Split 1 Qual #1',
            full_name: 'Canada Contenders Series: Season 2 - Split 1 - Qualifier #1',
            scheduled_date_start: '2022-03-04',
            scheduled_date_end: '2022-03-06',
            registration_enabled: true,
            size: 32,
            registration_opening_datetime: dayjs('2022-02-28').toISOString(),
            registration_closing_datetime: dayjs(new Date('March 4, 2022 21:00:00')).toISOString(),
        },
        {
            id: 's2p1q2',
            short_name: 'Split 1 - Qualifier #2',
            name: 'CCL: S2 Split 2 Qual #2',
            full_name: 'Canada Contenders Series: Season 2 - Split 1 - Qualifier #2',
            scheduled_date_start: '2022-03-11',
            scheduled_date_end: '2022-03-13',
            registration_enabled: true,
            size: 32,
            registration_opening_datetime: dayjs('2022-03-06').toISOString(),
            registration_closing_datetime: dayjs(new Date('March 11, 2022 21:00:00')).toISOString(),
        },
    ],

    BASE_MATCH: new Date(new Date().getUTCDate()),
    MATCH_DAYS: ['Mon', 'Wednes', 'Fri'],
    WEEK_FORMATTER: (week: { matches: MatchWithDate[] }[]) => {
        return week
            .reduce((acc, elem) => {
                acc.push(elem.matches)
                return acc
            }, [])
            .sort((a, b) => {
                return new Date(a[0].scheduled_datetime).getTime() - new Date(b[0].scheduled_datetime).getTime()
            })
    },
}

export const Seasons: Record<string, Season> = {
    one: SeasonOne,
    two: SeasonTwoSplit1,
}

export const defaultSeason = SeasonTwoSplit1

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

export function getCurrentSeason(params: { season: string }): Season {
    if (params.season in Seasons) {
        return Seasons[params.season]
    }
    return SeasonTwoSplit1
}

export function getSeasonPaths(extension: string): string[] {
    return Object.keys(Seasons).map((season) => `/seasons/${season}/${extension}`)
}
