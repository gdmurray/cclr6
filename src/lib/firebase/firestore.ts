import firebase from '@lib/firebase/firebase'

const db = firebase.firestore()


export const getTeamByUserID = userId => {
    return db.collection('teams')
}

export const FieldValue = firebase.firestore.FieldValue

export default db