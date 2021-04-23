import './firebase'
import * as firebaseAdmin from 'firebase-admin'
import { decrypt } from './crypto'
import { ADMIN_DATA } from './config'


export const loadFirebaseServiceAccount = () => {
    const encodedKey = ADMIN_DATA
    if (encodedKey) {
        const decodedData = decrypt(encodedKey)
        return JSON.parse(decodedData)
    }
    throw new Error('Admin Key Doesn\'t exist')
}

if (!firebaseAdmin.apps.length) {
    const serviceAccount = loadFirebaseServiceAccount()
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