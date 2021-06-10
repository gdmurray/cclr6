import './firebase'
import * as firebaseAdmin from 'firebase-admin'
import decrypted from '../secret/firebase-account'

if (!firebaseAdmin.apps.length) {
    const serviceAccount = decrypted
    const firebaseAdminDB = `https://${process.env.FIREBASE_ADMIN_DATABASE}.firebaseio.com`
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
            projectId: serviceAccount.project_id,
            clientEmail: serviceAccount.client_email,
            privateKey: serviceAccount.private_key,
        }),
        databaseURL: firebaseAdminDB,
    })
}

const auth = firebaseAdmin.auth()
export const adminFireStore = firebaseAdmin.firestore()
export const FieldValue = firebaseAdmin.firestore.FieldValue
export const adminDb = firebaseAdmin.database()
export default firebaseAdmin
export { auth }
