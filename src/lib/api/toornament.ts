import { Tournament } from '@lib/models/tournament'
import { adminDb } from '@lib/firebase-admin'
import dayjs from 'dayjs'

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


interface ToornamentAPI {
    getTournament(id: number): Promise<Tournament>;

    getTournaments(): Promise<Tournament[]>;
}

interface OAuth2Result {
    expires_in: number;
    access_token: string;
    scope: string;

}

export function ToornamentClient(): ToornamentAPI {
    async function retrieveCredentials(): Promise<OAuth2Result> {
        console.log('Retreiving credentials...')
        const result = await adminDb.ref('toornament').get()
        if (result.exists()) {
            const credentials = result.val()
            const { expires_on, access_token } = credentials
            if (dayjs() >= dayjs(expires_on)) {
                console.log('Credentials Expired')
                const refresh = await refreshCredentials()
                await setCredentials(refresh)
                return refresh
            } else {
                return credentials
            }
        } else {
            const refresh = await refreshCredentials()
            await setCredentials(refresh)
            return refresh
        }
    }

    async function setCredentials(credentials: OAuth2Result): Promise<void> {
        console.log('Setting credentials...')
        const now = new Date()
        now.setSeconds(now.getSeconds() + 10800)
        const expires_on = now.toUTCString()
        const { access_token, scope } = credentials
        await adminDb.ref('toornament').set({
            access_token: access_token,
            expires_on: expires_on,
            scope: scope
        })
        return Promise.resolve()
    }

    async function refreshCredentials(): Promise<OAuth2Result> {
        console.log('Refreshing credentials...')
        const authURL = new URL('https://api.toornament.com/oauth/v2/token')
        const params = {
            grant_type: 'client_credentials',
            client_id: process.env.TOORNAMENT_CLIENT_ID,
            client_secret: process.env.TOORNAMENT_CLIENT_SECRET,
            scope: 'organizer:view'
        }
        authURL.search = new URLSearchParams(params).toString()
        const result = await fetch(authURL.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        const body = await result.json()
        return Promise.resolve(body)
    }

    return {
        async getTournaments(): Promise<Tournament[]> {
            const { access_token } = await retrieveCredentials()
            const response = await fetch('https://api.toornament.com/organizer/v2/tournaments?public=true', {
                headers: {
                    'X-Api-Key': process.env.TOORNAMENT_API_KEY,
                    'Authorization': `Bearer ${access_token}`,
                    'Range': 'tournaments=0-49'
                }
            })
            const tournaments = await response.json()
            return Promise.resolve(tournaments)
        },
        async getTournament(id: number): Promise<Tournament> {
            return Promise.resolve(data[id])
        }
    }
}