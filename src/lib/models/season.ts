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
            // id: '1'
            id: '4586031971897286656'
        },
        {
            // id: '2'
            id: '4656151368065269760'
        },
        {
            id: '3'
        },
        {
            id: '4'
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
