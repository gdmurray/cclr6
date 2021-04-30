import db from '@lib/firestore'
import { Tournament } from '@lib/models/tournament'
import { IPlayer } from '@lib/models/player'

export interface ITeam {
    id?: string;
    name: string;
    logo: string;
    contact_email: string;
    owner: string;
    role?: string;
}

interface TeamClient {
    hasMinimumPlayers(): Promise<boolean>;

    hasMinimumCanadians(): Promise<boolean>

    hasTeamRegistered(tournament: Tournament): Promise<boolean>;

    canUserRegister(uid: string): boolean;
}

export function CreateTeamClient(team: ITeam): TeamClient {
    return {
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
            console.log(players.size)
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
        hasTeamRegistered: async (tournament): Promise<boolean> => {
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
                // todo: add some sort of status field
                return Promise.resolve(true)
            }
            return Promise.resolve(false)
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