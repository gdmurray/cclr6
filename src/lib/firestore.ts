import firebase from '@lib/firebase'

const db = firebase.firestore()


export const getTeamByUserID = userId => {
    return db.collection('teams')
}

export default db