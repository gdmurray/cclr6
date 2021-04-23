import './firebase'
import * as firebaseAdmin from 'firebase-admin'

if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
    })
}

const firestore = firebaseAdmin.firestore()
const auth = firebaseAdmin.auth()

export default firebaseAdmin
export { firestore, auth }