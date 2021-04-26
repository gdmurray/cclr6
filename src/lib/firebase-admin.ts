import './firebase'
import * as firebaseAdmin from 'firebase-admin'
import decrypted from './secret/firebase-account'


if (!firebaseAdmin.apps.length) {
    const serviceAccount = decrypted
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
            projectId: serviceAccount.project_id,
            clientEmail: serviceAccount.client_email,
            privateKey: serviceAccount.private_key
        })
    })
}

const firestore = firebaseAdmin.firestore()
const auth = firebaseAdmin.auth()

export default firebaseAdmin
export { firestore, auth }