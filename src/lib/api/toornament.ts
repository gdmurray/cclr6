import { Tournament } from '@lib/models/tournament'

interface ToornamentAPI {
    getTournament(id: number): Promise<Tournament>;
}

const tournaments = [
    {
        name: 'Open Qualifier #1',
        full_name: 'CCL Stage 1 Open Qualifier #1',
        scheduled_date_start: '2021-06-05',
        scheduled_date_end: '2021-06-06',
        timezone: 'America/Toronto',
        public: false,
        size: 32,
        online: true,
        logo: {
            original: '/images/backgroundtemp.jpeg'
        },
        location: 'Toronto',
        country: 'CA',
        registration_enabled: true,
        registration_opening_datetime: new Date(2021, 5 - 1, 29, 9).toISOString(),
        registration_closing_datetime: new Date(2021, 6 - 1, 30, 9).toISOString(),
        id: '123456789',
        discipline: 'rainbowsix_siege',
        platforms: [
            'pc'
        ]
    }
]

const data: Tournament[] = [
    {
        name: 'CCL Open Qualifier #1',
        full_name: 'CCL Stage 1 Open Qualifier #1',
        scheduled_date_start: '2021-06-05',
        scheduled_date_end: '2021-06-06',
        timezone: 'America/Toronto',
        public: false,
        size: 32,
        online: true,
        logo: { original: '/images/backgroundtemp.jpeg' },
        location: 'Toronto',
        country: 'CA',
        registration_enabled: true,
        registration_opening_datetime: '2021-05-01T13:00:00.000Z',
        registration_closing_datetime: '2021-06-06T13:00:00.000Z',
        id: '1',
        discipline: 'rainbowsix_siege',
        platforms: ['pc']
    },
    {
        name: 'CCL Open Qualifier #2',
        full_name: 'CCL Stage 1 Open Qualifier #2',
        scheduled_date_start: '2021-06-12',
        scheduled_date_end: '2021-06-13',
        timezone: 'America/Toronto',
        public: false,
        size: 32,
        online: true,
        logo: { original: '/images/backgroundtemp.jpeg' },
        location: 'Toronto',
        country: 'CA',
        registration_enabled: true,
        registration_opening_datetime: '2021-06-05T13:00:00.000Z',
        registration_closing_datetime: '2021-06-13T13:00:00.000Z',
        id: '2',
        discipline: 'rainbowsix_siege',
        platforms: ['pc']
    },
    {
        name: 'CCL Open Qualifier #3',
        full_name: 'CCL Stage 1 Open Qualifier #3',
        scheduled_date_start: '2021-06-19',
        scheduled_date_end: '2021-06-20',
        timezone: 'America/Toronto',
        public: false,
        size: 32,
        online: true,
        logo: { original: '/images/backgroundtemp.jpeg' },
        location: 'Toronto',
        country: 'CA',
        registration_enabled: true,
        registration_opening_datetime: '2021-06-12T13:00:00.000Z',
        registration_closing_datetime: '2021-06-20T13:00:00.000Z',
        id: '3',
        discipline: 'rainbowsix_siege',
        platforms: ['pc']
    },
    {
        name: 'CCL Open Qualifier #4',
        full_name: 'CCL Stage 1 Open Qualifier #4',
        scheduled_date_start: '2021-06-26',
        scheduled_date_end: '2021-06-27',
        timezone: 'America/Toronto',
        public: false,
        size: 32,
        online: true,
        logo: { original: '/images/backgroundtemp.jpeg' },
        location: 'Toronto',
        country: 'CA',
        registration_enabled: true,
        registration_opening_datetime: '2021-06-19T13:00:00.000Z',
        registration_closing_datetime: '2021-06-27T13:00:00.000Z',
        id: '4',
        discipline: 'rainbowsix_siege',
        platforms: ['pc']
    }
]


export function ToornamentClient(): ToornamentAPI {
    return {
        async getTournament(id: number): Promise<Tournament> {
            return Promise.resolve(data[id])
        }
    }
}