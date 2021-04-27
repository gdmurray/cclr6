import firebase from './firebase'

const db = firebase.firestore()


export interface ITeam {
    id?: string;
    name: string;
    logo: string;
    contact_email: string;
    owner: string;
    role?: string;
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
    }
}
export const getTeamByUserID = userId => {
    return db.collection('teams')
}

export default db