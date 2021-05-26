import db from '@lib/firebase/firestore'
import { CaptureOrderResponseBody } from '@paypal/paypal-js/types/apis/orders'
import { IPlayer } from '@lib/models/player'
import { Firestore, storage } from '@lib/firebase/firebase'
import { Tournament } from '@lib/models/tournament'
import { SeasonOne } from '@lib/models/season'

export interface ITeam {
    id?: string;
    name: string;
    logo: string;
    contact_email: string;
    owner: string;
    role?: string;
}

export interface IRegistration {
    participant_id: string;
    tournament_id: string;
    status: 'REGISTERED';
    registered: any;
}

interface TeamClient {
    hasMinimumPlayers(): Promise<boolean>;

    hasMinimumCanadians(): Promise<boolean>

    hasTeamRegistered(tournamentId: string): Promise<boolean | IRegistration>;

    canUserRegister(uid: string): boolean;

    purchasePass(season: string, payment: CaptureOrderResponseBody): Promise<void>

    getPayments(): Promise<any[]>;

    hasTeamPaid(season: string): Promise<boolean>;

    registerForTournament(tournamentId: string, participantId: string): Promise<boolean>;

    getRegistration(tournamentId: string): Promise<IRegistration>;

    getRegistrations(): Promise<IRegistration[]>;

    hasQualified(): Promise<boolean>;
}

// FirebaseFirestore.Firestore
export function CreateTeamClient(team: ITeam, database: Firestore | any = db): TeamClient {

    return {
        purchasePass: async (season, payment): Promise<void> => {
            const data = {
                season,
                payment
            }
            const paymentResult = await database.collection('teams')
                .doc(team.id)
                .collection('payments')
                .add(data)
            console.log(paymentResult.id)
            console.log(paymentResult.get().then(result => console.log(result.data())))
            return Promise.resolve()
        },
        hasTeamPaid: async (seasonId): Promise<boolean> => {
            const payments = await database.collection('teams')
                .doc(team.id)
                .collection('payments')
                .where('season', '==', seasonId)
                .get()
            if (payments.size > 0) {
                const paymentData = payments.docs[0].data()
                if (paymentData.payment.status === 'COMPLETED') {
                    return Promise.resolve(true)
                }
            }
            return Promise.resolve(false)
        },
        getPayments: async (): Promise<any[]> => {
            const payments = await database.collection('teams')
                .doc(team.id)
                .collection('payments')
                .get()
            return payments.docs
        },
        hasMinimumPlayers: async (): Promise<boolean> => {
            const players = await database.collection('teams')
                .doc(team.id)
                .collection('players')
                .get()
            if (players.size >= 5) {
                return Promise.resolve(true)
            }
            return Promise.resolve(false)
        },
        hasMinimumCanadians: async (): Promise<boolean> => {
            const players = await database.collection('teams')
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
        async hasTeamRegistered(tournamentId): Promise<boolean | IRegistration> {
            const registration = await this.getRegistration(tournamentId)
            if (registration) {
                if (registration.status === 'REGISTERED') {
                    return Promise.resolve(registration)
                }
            }
            return Promise.resolve(false)
            // const registration = await database.collection('teams')
            //     .doc(team.id)
            //     .collection('registrations')
            //     .where('tournament_id', '==', tournamentId)
            //     .get()
            // if (registration.empty) {
            //     return Promise.resolve(false)
            // }
            // if (registration.size === 1) {
            //     const data = registration.docs[0].data()
            //     if (data.status === 'REGISTERED') {
            //         return Promise.resolve(data as IRegistration)
            //     }
            //
            // }
            // return Promise.resolve(false)
        },
        registerForTournament: async (tournamentId, participantId): Promise<boolean> => {
            const registration = await database.collection('teams')
                .doc(team.id)
                .collection('registrations')
                .add({
                    tournament_id: tournamentId,
                    participant_id: participantId,
                    status: 'REGISTERED',
                    registered: new Date().toISOString()
                })
            console.log(tournamentId)
            const data = await registration.get()
            return Promise.resolve(true)
        },
        canUserRegister: (uid): boolean => {
            return (team.owner === uid)
        },
        getRegistration: async (tournamentId): Promise<IRegistration | null> => {
            const registration = await database.collection('teams')
                .doc(team.id)
                .collection('registrations')
                .where('tournament_id', '==', tournamentId)
                .get()
            if (registration.empty) {
                return Promise.resolve(null)
            }
            if (registration.size === 1) {
                const data = registration.docs[0].data()
                return Promise.resolve(data)
            }
        },
        getRegistrations: async (): Promise<IRegistration[]> => {
            const registrations = await database
                .collection('teams')
                .doc(team.id)
                .collection('registrations')
                .get()
            return Promise.resolve(registrations.docs.map((reg) => ({ id: reg.id, ...reg.data() })))
        },
        async hasQualified(): Promise<boolean> {
            const season = SeasonOne
            const registrations = []
            for (let i = 0; i < season.qualifiers.length; i += 1) {
                const registration = await this.getRegistration(season.qualifiers[i].id)
                if (registration) {
                    registrations.push(registration)
                }
            }
            const qualified = registrations.filter((reg) => reg.status === 'QUALIFIED')
            if (qualified.length > 0) {
                return Promise.resolve(true)
            }
            return Promise.resolve(false)
        }
    }
}

export const Teams = {
    getTeamByUserID: async (userId: string): Promise<ITeam | null> => {
        const teamWithOwner = await db
            .collection('teams')
            .where('owner', '==', userId)
            .get()
        if (!teamWithOwner.empty) {
            const team = teamWithOwner.docs[0]
            return {
                id: teamWithOwner.docs[0].id,
                ...teamWithOwner.docs[0].data(),
                role: 'Owner'
            } as ITeam
        }
        const teamWithPlayer = await db
            .collection('teams')
            .where('players', 'array-contains', userId)
            .get()
        if (!teamWithPlayer.empty) {
            const team = teamWithPlayer.docs[0]
            return {
                id: teamWithPlayer.docs[0].id,
                ...teamWithPlayer.docs[0].data(),
                role: 'Player'
            } as ITeam
        }
        return null
    },
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
    createTeam: (data: ITeam, user) => {
        if (data.logo === undefined) {
            data.logo = null
        }
        return db
            .collection('teams')
            .add({
                owner: user.uid,
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

export const uploadLogoToStorage = (logo: File, callback: (url) => void): void => {
    const logoName = `${logo.lastModified}-${logo.name}`
    const uploadTask = storage.ref(`/images/${logoName}`).put(logo)
    uploadTask.on('state_changes', (snapshot) => {
        console.log(snapshot)
    }, (err) => {
        console.log('error: ', err)
    }, () => {
        storage.ref('images').child(logoName).getDownloadURL()
            .then(fireBaseUrl => {
                callback(fireBaseUrl)
                return fireBaseUrl
            })
    })
}