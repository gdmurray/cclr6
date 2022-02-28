import { Tournament } from '@lib/models/tournament'
import dayjs from 'dayjs'

export interface Season {
    id: string
    active: boolean
    name: string
    toornamentId: string
    start_date: string
    end_date: string
    registration_opens: string
    registration_closes: string
    qualifiers: Partial<Tournament>[]
}

export const SeasonOne: Season = {
    id: '1',
    active: false,
    toornamentId: '4585711997166354432',
    start_date: '2021-07-01',
    end_date: '2021-09-01',
    registration_opens: '2021-02-22',
    registration_closes: '',
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
}

export const SeasonTwoSplit1: Season = {
    id: 's2p1',
    active: true,
    toornamentId: '',
    start_date: '2022-03-21',
    end_date: '2022-04-15',
    registration_opens: '2022-02-28',
    registration_closes: '2022-03-12',
    name: 'Canada Contenders Series: Season 2 - Split 1',
    qualifiers: [
        {
            id: 's2p1q1',
            name: 'CCL: S2 Split 1 Qual #1',
            full_name: 'Canada Contenders Series: Season 2 - Split 1 - Qualifier #1',
            scheduled_date_start: '2022-03-04',
            scheduled_date_end: '2022-03-06',
            registration_enabled: true,
            registration_opening_datetime: dayjs('2022-02-28').toISOString(),
            registration_closing_datetime: dayjs(new Date('March 4, 2022 16:00:00')).toISOString(),
        },
        {
            id: 's2p1q2',
            name: 'CCL: S2 Split 2 Qual #2',
            full_name: 'Canada Contenders Series: Season 2 - Split 1 - Qualifier #2',
            scheduled_date_start: '2022-03-11',
            scheduled_date_end: '2022-03-13',
            registration_enabled: true,
            registration_opening_datetime: dayjs('2022-03-06').toISOString(),
            registration_closing_datetime: dayjs(new Date('March 11, 2022 16:00:00')).toISOString(),
        },
    ],
}
