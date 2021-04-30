import dayjs from 'dayjs'

export interface Tournament {
    name: string;
    full_name: string;
    scheduled_date_start: string;
    scheduled_date_end: string;
    timezone: string;
    prize: string;
    public: boolean;
    size: number;
    online: boolean;
    location: string;
    country: 'CA';
    logo?: {
        logo_small?: string;
        logo_medium?: string;
        logo_large?: string;
        original: string;
    }
    registration_enabled: true;
    registration_opening_datetime: string;
    registration_closing_datetime: string;
    id: string;
    discipline: string;
    platforms: string[];
}

interface TournamentClient {
    hasStarted(): boolean

    isRegistrationOpen(): boolean

    hasRegistrationStarted(): boolean;

    hasRegistrationClosed(): boolean;

}

export function CreateTournamentClient(tournament: Tournament): TournamentClient {
    return {
        hasStarted(): boolean {
            return dayjs().toDate() > dayjs(tournament.scheduled_date_start).toDate()
        },

        isRegistrationOpen(): boolean {
            if (this.hasStarted()) {
                return false
            }

            if (!tournament.registration_enabled) {
                return false

            }
            return (this.hasRegistrationStarted() && !this.hasRegistrationClosed())
        },

        hasRegistrationStarted(): boolean {
            return (dayjs() > dayjs(tournament.registration_opening_datetime))
        },

        hasRegistrationClosed(): boolean {
            return (dayjs() >= dayjs(tournament.registration_closing_datetime))
        }

    }
}
