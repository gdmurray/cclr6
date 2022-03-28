import db from '@lib/firebase/firestore'
import { CaptureOrderResponseBody } from '@paypal/paypal-js/types/apis/orders'
import { IPlayer } from '@lib/models/player'
import { Firestore, storage } from '@lib/firebase/firebase'
import { SeasonTwoSplit1 } from '@lib/season/common'

export interface ITeam {
    id?: string
    name: string
    short_name?: string
    slug?: string
    logo: string
    contact_email: string
    owner: string
    role?: string
    notification_settings?: {
        registration: boolean
        payment: boolean
        qualification: boolean
    }
    twitter?: string
}

export interface IRegistration {
    id?: string
    participant_id: string
    tournament_id: string
    status: 'REGISTERED' | 'QUALIFIED'
    registered: any
}

interface TeamClient {
    hasMinimumPlayers(): Promise<boolean>

    hasMinimumCanadians(): Promise<boolean>

    hasTeamRegistered(tournamentId: string): Promise<false | IRegistration>

    canUserRegister(uid: string): boolean

    purchasePass(season: string, payment: CaptureOrderResponseBody): Promise<void>

    getPayments(): Promise<any[]>

    getPaymentsStartingWith(prefix: string): Promise<any[]>

    hasTeamPaid(season: string): Promise<boolean>

    hasPaidForQualifier(qualifier: string): Promise<boolean>

    registerForTournament(tournamentId: string, participantId: string): Promise<boolean>

    unregisterForTournament(registrationId: string): Promise<boolean>

    getRegistration(tournamentId: string): Promise<IRegistration>

    getRegistrations(): Promise<IRegistration[]>

    hasQualified(): Promise<boolean>

    canSendNotification(notification: string): boolean
}

export function CreateTeamClient(team: ITeam, database: Firestore | any = db): TeamClient {
    return <TeamClient>{
        purchasePass: async (season, payment): Promise<void> => {
            const data = {
                season,
                payment,
            }
            const paymentResult = await database
                .collection('teams')
                .doc(team.id)
                .collection('payments')
                .add({ type: 'paypal', ...data })
            console.log(paymentResult.get().then((result) => console.log(result.data())))
            return Promise.resolve()
        },
        hasTeamPaid: async (seasonId): Promise<boolean> => {
            const payments = await database
                .collection('teams')
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
            const payments = await database.collection('teams').doc(team.id).collection('payments').get()
            return payments.docs
        },
        getPaymentsStartingWith: async (prefix: string): Promise<any[]> => {
            const payments = await database
                .collection('teams')
                .doc(team.id)
                .collection('payments')
                .where('season', '>=', prefix)
                .get()
            return payments.docs
        },
        async hasPaidForQualifier(qualifier: string): Promise<boolean> {
            const query = qualifier.slice(0, -2)
            const payments = await this.getPaymentsStartingWith(query)
            return (
                payments.findIndex((elem) => elem.season === 's2p1') !== -1 ||
                payments.findIndex((elem) => elem.season === qualifier) !== -1
            )
        },
        hasMinimumPlayers: async (): Promise<boolean> => {
            const players = await database.collection('teams').doc(team.id).collection('players').get()
            if (players.size >= 5) {
                return Promise.resolve(true)
            }
            return Promise.resolve(false)
        },
        hasMinimumCanadians: async (): Promise<boolean> => {
            const players = await database.collection('teams').doc(team.id).collection('players').get()
            if (players.size >= 5) {
                const countryCounts = players.docs.reduce(
                    (acc: { CA: number; USA: number }, doc) => {
                        const data = doc.data() as IPlayer
                        if (data.country === 'CA') {
                            acc['CA'] += 1
                        } else {
                            acc['USA'] += 1
                        }
                        return acc
                    },
                    { CA: 0, USA: 0 }
                )

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
            const registration = await database.collection('teams').doc(team.id).collection('registrations').add({
                tournament_id: tournamentId,
                participant_id: participantId,
                status: 'REGISTERED',
                registered: new Date().toISOString(),
            })
            return Promise.resolve(true)
        },
        unregisterForTournament: async (registrationID): Promise<boolean> => {
            const registration = await database
                .collection('teams')
                .doc(team.id)
                .collection('registrations')
                .doc(registrationID)
                .delete()
            console.log(registration)
            return Promise.resolve(true)
        },
        canUserRegister: (uid): boolean => {
            return team.owner === uid
        },
        getRegistration: async (tournamentId): Promise<IRegistration | null> => {
            const registration = await database
                .collection('teams')
                .doc(team.id)
                .collection('registrations')
                .where('tournament_id', '==', tournamentId)
                .get()
            if (registration.empty) {
                return Promise.resolve(null)
            }
            if (registration.size === 1) {
                const data = { id: registration.docs[0].id, ...registration.docs[0].data() }
                return Promise.resolve(data)
            }
        },
        getRegistrations: async (): Promise<IRegistration[]> => {
            const registrations = await database.collection('teams').doc(team.id).collection('registrations').get()
            return Promise.resolve(registrations.docs.map((reg) => ({ id: reg.id, ...reg.data() })))
        },
        async hasQualified(): Promise<boolean> {
            const season = SeasonTwoSplit1
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
        },
        canSendNotification(notification: string): boolean {
            if (team.notification_settings) {
                if (team.notification_settings[notification] !== undefined) {
                    return team.notification_settings[notification]
                }
            }
            return true
        },
    }
}

export const Teams = {
    getTeamById: async (teamId: string, database: Firestore | any = db): Promise<ITeam | null> => {
        const team = await database.collection('teams').doc(teamId).get()
        return { id: team.id, ...team.data() } as ITeam
    },
    getTeamBySlug: async (teamSlug: string): Promise<ITeam | null> => {
        const team = await db.collection('teams').where('slug', '==', teamSlug).get()
        if (team.empty) {
            return null
        }
        return { id: team.docs[0].id, ...team.docs[0].data() } as ITeam
    },
    getTeamByUserID: async (userId: string): Promise<ITeam | null> => {
        const teamWithOwner = await db.collection('teams').where('owner', '==', userId).get()
        if (!teamWithOwner.empty) {
            // const team = teamWithOwner.docs[0]
            return {
                id: teamWithOwner.docs[0].id,
                ...teamWithOwner.docs[0].data(),
                role: 'Owner',
            } as ITeam
        }
        const teamWithPlayer = await db.collection('teams').where('players', 'array-contains', userId).get()
        if (!teamWithPlayer.empty) {
            // const team = teamWithPlayer.docs[0]
            return {
                id: teamWithPlayer.docs[0].id,
                ...teamWithPlayer.docs[0].data(),
                role: 'Player',
            } as ITeam
        }
        return null
    },
    getTeamByOwnerID: (userId: string) => {
        return db
            .collection('teams')
            .where('owner', '==', userId)
            .get()
            .then((result) => {
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
        return db.collection('teams').add({
            name: '',
            logo: '',
            owner: userId,
        })
    },
    createTeam: (data: ITeam, user) => {
        if (data.logo === undefined) {
            data.logo = null
        }
        return db.collection('teams').add({
            owner: user.uid,
            ...data,
            setup_completed: false,
        })
    },
    updateTeam: (id, data: Partial<ITeam>) => {
        return db
            .collection('teams')
            .doc(id)
            .update({
                ...data,
            })
    },
    getPlayers: (id, database: Firestore | any = db) => {
        return database.collection('teams').doc(id).collection('players').get()
    },
    getPlayersCollection: (id) => {
        return db.collection('teams').doc(id)
    },
    getTeams: () => {
        return db.collection('teams').get()
    },
    getTeamIdMap: async () => {
        const teamsData = await db.collection('teams').get()
        const teamsIdMap = teamsData.docs.reduce((acc, value) => {
            acc[value.id] = {
                id: value.id,
                ...value.data(),
            }
            return acc
        }, {})
        return Promise.resolve(teamsIdMap)
    },
}

export const uploadLogoToStorage = (logo: File, callback: (url) => void): void => {
    const logoName = `${logo.lastModified}-${logo.name}`
    const uploadTask = storage.ref(`/images/${logoName}`).put(logo)
    uploadTask.on(
        'state_changes',
        (snapshot) => {
            console.log(snapshot)
        },
        (err) => {
            console.log('error: ', err)
        },
        () => {
            storage
                .ref('images')
                .child(logoName)
                .getDownloadURL()
                .then((fireBaseUrl) => {
                    callback(fireBaseUrl)
                    return fireBaseUrl
                })
        }
    )
}
