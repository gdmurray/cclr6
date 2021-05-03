import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/analytics'


// let twitterProvider
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        appId: process.env.FIREBASE_APP_ID,
        storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    })
}

const twitterProvider = new firebase.auth.TwitterAuthProvider()
export const Timestamp = firebase.firestore.Timestamp
export const storage = firebase.storage()
const analytics = (): firebase.analytics.Analytics => firebase.analytics()
export type FirebaseUser = firebase.User;
export type UserInfo = firebase.UserInfo
twitterProvider.setCustomParameters({
    oauth_callback: encodeURI('http://localhost:3001/callback')
})
export { twitterProvider }
export default firebase