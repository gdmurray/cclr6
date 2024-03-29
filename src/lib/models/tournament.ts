import dayjs from 'dayjs'

export interface Tournament {
    short_name: string
    name: string
    full_name: string
    scheduled_date_start: string
    scheduled_date_end: string
    timezone: string
    prize?: string
    public: boolean
    size: number
    online: boolean
    location: string
    country: 'CA'
    logo?: {
        logo_small?: string
        logo_medium?: string
        logo_large?: string
        original: string
    }
    registration_enabled: true
    registration_opening_datetime: string
    registration_closing_datetime: string
    id: string
    discipline: string
    platforms: string[]
    toornament_id?: string
}

interface TournamentClient {
    isOver(): boolean

    hasStarted(): boolean

    isRegistrationOpen(): boolean

    hasRegistrationStarted(): boolean

    hasRegistrationClosed(): boolean
}

// TODO: Cannot register when registration ends (4head)
export function CreateTournamentClient(tournament: Tournament): TournamentClient {
    return {
        isOver(): boolean {
            return dayjs().toDate() > dayjs(tournament.scheduled_date_end).toDate()
        },

        hasStarted(): boolean {
            return dayjs().toDate() > dayjs(tournament.scheduled_date_start).add(1, 'days').toDate()
        },

        isRegistrationOpen(): boolean {
            console.log('Has Started: ', this.hasStarted())
            if (this.hasStarted()) {
                return false
            }

            return this.hasRegistrationStarted() && !this.hasRegistrationClosed()
        },

        hasRegistrationStarted(): boolean {
            return dayjs() > dayjs(tournament.registration_opening_datetime)
        },

        hasRegistrationClosed(): boolean {
            return dayjs() >= dayjs(tournament.registration_closing_datetime)
        },
    }
}
