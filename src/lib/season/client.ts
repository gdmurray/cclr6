import { Firestore } from '@lib/firebase'
import db from '@lib/firebase/firestore'
import { IRegistration } from '@lib/models/team'

export function CreateSeasonClient(database: Firestore | any = db) {
    return {
        getRegisteredTeams: async (tournamentId, teamData = false): Promise<IRegistration[]> => {
            const registrations = await database
                .collectionGroup('registrations')
                .where('tournament_id', '==', tournamentId)
                .get()
            if (teamData == true) {
                return Promise.all(
                    registrations.docs.map((elem) => {
                        const segments = elem.ref.parent._queryOptions.parentPath.segments
                        return elem.ref.parent._serializer
                            .createReference(segments.join('/'))
                            .get()
                            .then(async (result) => {
                                const teamData = result.data()
                                const players = await database
                                    .collection('teams')
                                    .doc(result.id)
                                    .collection('players')
                                    .get()
                                return {
                                    id: result.id,
                                    name: teamData.name,
                                    players: players.docs.map((elem) => ({
                                        ...elem.data(),
                                    })),
                                    ...elem.data(),
                                    ...teamData,
                                }
                            })
                    })
                )
            }
            return registrations.docs.map((elem) => ({ ...elem.data() }))
        },
    }
}
