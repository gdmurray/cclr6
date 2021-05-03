import * as functions from 'firebase-functions'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info('Hello logs!', { structuredData: true })
    response.send('Hello from Firebase!')
})

functions.database.ref('/teams').onUpdate(async change => {
    const data = change.after.val()
    functions.logger.info(data, { structuredData: true })
})