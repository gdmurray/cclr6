import db from '@lib/firestore'
import { Tournament } from '@lib/models/tournament'
import { CaptureOrderResponseBody } from '@paypal/paypal-js/types/apis/orders'
import { IPlayer } from '@lib/models/player'
import { Timestamp } from '@lib/firebase'

export interface ITeam {
    id?: string;
    name: string;
    logo: string;
    contact_email: string;
    owner: string;
    role?: string;
}

export interface IRegistration {
    tournament_id: string;
    status: 'REGISTERED';
    registered: any;
}

interface TeamClient {
    hasMinimumPlayers(): Promise<boolean>;

    hasMinimumCanadians(): Promise<boolean>

    hasTeamRegistered(tournament: Tournament): Promise<boolean | IRegistration>;

    canUserRegister(uid: string): boolean;

    purchasePass(season: string, payment: CaptureOrderResponseBody): Promise<void>

    getPayments(): Promise<any[]>;

    hasTeamPaid(season: string): Promise<boolean>;

    registerForTournament(tournament: Tournament): Promise<boolean>;
}

export function CreateTeamClient(team: ITeam): TeamClient {
    return {
        purchasePass: async (season, payment): Promise<void> => {
            console.log(season, payment)
            const data = {
                season,
                payment
            }
            const paymentResult = await db.collection('teams')
                .doc(team.id)
                .collection('payments')
                .add(data)
            console.log(paymentResult.id)
            console.log(paymentResult.get().then(result => console.log(result.data())))
            return Promise.resolve()
        },
        hasTeamPaid: async (seasonId): Promise<boolean> => {
            const payments = await db.collection('teams')
                .doc(team.id)
                .collection('payments')
                .where('season', '==', seasonId)
                .get()
            console.log("Has Team PAid? ");
            if (payments.size > 0) {
                const paymentData = payments.docs[0].data()
                if (paymentData.payment.status === 'COMPLETED') {
                    return Promise.resolve(true)
                }
            }
            return Promise.resolve(false)
        },
        getPayments: async (): Promise<any[]> => {
            const payments = await db.collection('teams')
                .doc(team.id)
                .collection('payments')
                .get()
            return payments.docs
        },
        hasMinimumPlayers: async (): Promise<boolean> => {
            const players = await db.collection('teams')
                .doc(team.id)
                .collection('players')
                .get()
            if (players.size >= 5) {
                return Promise.resolve(true)
            }
            return Promise.resolve(false)
        },
        hasMinimumCanadians: async (): Promise<boolean> => {
            const players = await db.collection('teams')
                .doc(team.id)
                .collection('players')
                .get()
            if (players.size >= 5) {
                const countryCounts = players.docs.reduce((acc: { CA: number, USA: number, }, doc) => {
                    const data = doc.data() as IPlayer
                    if (data.country === 'CA') {
                        acc['CA'] += 1
                    } else {
                        acc['USA'] += 1
                    }
                    return acc
                }, { CA: 0, USA: 0 })

                if (countryCounts.CA >= 3) {
                    return Promise.resolve(true)
                }
            }
            return Promise.resolve(false)

        },
        hasTeamRegistered: async (tournament): Promise<boolean | IRegistration> => {
            console.log(tournament.id)
            const registration = await db.collection('teams')
                .doc(team.id)
                .collection('registrations')
                .where('tournament_id', '==', tournament.id)
                .get()
            if (registration.empty) {
                return Promise.resolve(false)
            }
            if (registration.size === 1) {
                const data = registration.docs[0].data()
                if (data.status === 'REGISTERED') {
                    return Promise.resolve(data as IRegistration)
                }

            }
            return Promise.resolve(false)
        },
        registerForTournament: async (tournament): Promise<boolean> => {
            const registration = await db.collection('teams')
                .doc(team.id)
                .collection('registrations')
                .add({
                    tournament_id: tournament.id,
                    status: 'REGISTERED',
                    registered: Timestamp.now()
                })
            const data = await registration.get()
            return Promise.resolve(true)
        },
        canUserRegister: (uid): boolean => {
            return (team.owner === uid)
        }
    }
}

export const Teams = {
    getTeamByOwnerID: (userId: string) => {
        return db
            .collection('teams')
            .where('owner', '==', userId)
            .get().then((result) => {
                if (result.empty) {
                    return false
                } else if (result.docs.length > 1) {
                    throw Error('User Runs multiple Teams')
                } else if (result.docs.length === 1) {
                    return result.docs[0]
                }
            })
    },
    createTeamByUserID: (userId: string) => {
        return db
            .collection('teams')
            .add({
                name: '',
                logo: '',
                owner: userId
            })
    },
    createTeam: (data: ITeam) => {
        return db
            .collection('teams')
            .add({
                ...data,
                setup_completed: false
            })
    },
    updateTeam: (id, data: Partial<ITeam>) => {
        return db
            .collection('teams')
            .doc(id)
            .update({
                ...data
            })
    },
    getPlayers: (id) => {
        return db
            .collection('teams')
            .doc(id)
            .collection('players')
            .get()
    },
    getPlayersCollection: (id) => {
        return db
            .collection('teams')
            .doc(id)

    }
}