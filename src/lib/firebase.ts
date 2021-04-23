import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'


// let twitterProvider
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
        projectId: process.env.FIREBASE_PROJECT_ID,
        appId: process.env.FIREBASE_APP_ID
    })
}

const twitterProvider = new firebase.auth.TwitterAuthProvider()
export type FirebaseUser = firebase.User;
export type UserInfo = firebase.UserInfo
twitterProvider.setCustomParameters({
    oauth_callback: encodeURI('http://localhost:3001/callback')
})
export { twitterProvider }
export default firebase