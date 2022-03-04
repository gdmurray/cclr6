import { Tournament } from '@lib/models/tournament'

export const data: Tournament[] = [
    {
        name: 'CCL: Season 1',
        short_name: '',
        full_name: 'Canada Contenders Series: Season 1',
        scheduled_date_start: '2021-07-01',
        scheduled_date_end: '2021-08-01',
        timezone: 'America/Toronto',
        prize: '$300',
        public: false,
        size: 64,
        online: true,
        logo: {
            original: '/images/backgroundtemp.jpeg',
        },
        location: 'Toronto',
        country: 'CA',
        registration_enabled: true,
        registration_opening_datetime: new Date(2021, 3, 1, 9).toISOString(),
        registration_closing_datetime: new Date(2021, 5, 30, 9).toISOString(),
        id: '123456789',
        discipline: 'rainbowsix_siege',
        platforms: ['pc'],
    },
]
