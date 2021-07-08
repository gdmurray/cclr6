// @ts-ignore
const LocalizedFormat = require('dayjs/plugin/localizedFormat')
const dayjs = require('dayjs')
dayjs.extend(LocalizedFormat)

const startDate = '2021-06-05'
const endDate = '2021-06-06'

const data = []
const baseTournament = {
    name: null,
    full_name: null,
    scheduled_date_start: null,
    scheduled_date_end: null,
    timezone: 'America/Toronto',
    public: false,
    size: 32,
    online: true,
    logo: {
        original: '/images/backgroundtemp.jpeg',
    },
    location: 'Toronto',
    country: 'CA',
    registration_enabled: true,
    registration_opening_datetime: null,
    registration_closing_datetime: null,
    id: null,
    discipline: 'rainbowsix_siege',
    platforms: ['pc'],
}
const tournaments = []
for (let i = 0; i < 4; i += 1) {
    const tournament = { ...baseTournament }
    tournament.name = `CCL Open Qualifier #${i + 1}`
    tournament.full_name = `CCL Stage 1 Open Qualifier #${i + 1}`
    tournament.scheduled_date_start = dayjs(startDate).add(i, 'week').format('YYYY-MM-DD')
    tournament.scheduled_date_end = dayjs(endDate).add(i, 'week').format('YYYY-MM-DD')
    tournament.registration_opening_datetime = dayjs(startDate).add(i, 'week').subtract(1, 'week').hour(9).toISOString()
    tournament.registration_closing_datetime = dayjs(endDate).add(i, 'week').hour(9).toISOString()
    tournaments.push(tournament)
}
