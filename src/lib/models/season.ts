import { Tournament } from '@lib/models/tournament'
import dayjs from 'dayjs'

interface TournamentRef {
    id: number
}

export interface Season {
    id: string;
    active: boolean;
    name: string;
    toornamentId: string;
    start_date: string;
    end_date: string;
    qualifiers: Partial<Tournament>[]
}

export const SeasonOne: Season = {
    id: '1',
    active: true,
    toornamentId: '4585711997166354432',
    start_date: '2021-07-01',
    end_date: '2021-09-01',
    name: 'Canada Contenders Series: Season 1',
    qualifiers: [
        {
            id: process.env.FIREBASE_PROJECT_ID === 'ccl-content' ? '4586031971897286656' : '4657867830957891584'
        },
        {
            id: process.env.FIREBASE_PROJECT_ID === 'ccl-content' ? '4656151368065269760' : '4657870642085552128'
        },
        {
            id: '4656235654717947904'
        },
        {
            id: '4656251121246019584'
        }
    ]
}

interface SeasonAPI {
    hasStarted(): boolean;
}

export function SeasonClient(season: Season): SeasonAPI {
    return {
        hasStarted(): boolean {
            return (dayjs().toDate() > dayjs(season.start_date).toDate())
        }
    }
}
