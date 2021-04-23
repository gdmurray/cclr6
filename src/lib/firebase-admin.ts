import './firebase'
import * as firebaseAdmin from 'firebase-admin'

export const universalAtob = b64Encoded => {
    try {
        return atob(b64Encoded)
    } catch (err) {
        return Buffer.from(b64Encoded, 'base64').toString()
    }
}


export const loadFirebaseServiceAccount = () => {
    const encodedKey = process.env.FIREBASE_SERVICE_ACCOUNT
    if (encodedKey) {
        const decodedData = universalAtob(encodedKey)
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