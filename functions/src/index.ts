import * as functions from 'firebase-functions'
import { sendMail, verifyCloudTaskRequest } from './tasks'

// const cors = require('cors')({ origin: true })
//
// const anonymousTemplates = ['forgot_password']


// export const triggerEmail = functions.https.onRequest(async (req, res) => {
//     cors(req, res, async () => {
//         if (req.method === 'POST') {
//             try {
//                 const { template } = req.body
//                 if (templates.indexOf(template) !== -1) {
//                     if (anonymousTemplates.indexOf(template) === -1) {
//                         const authToken = validateHeader(req)
//                         if (!authToken) {
//                             res.status(403).send('Not authorized. Missing auth Token')
//                             return
//                         }
//
//                         const uid = await decodeAuthToken(authToken)
//                         if (uid === undefined) {
//                             res.status(403).send('Invalid or expired token.')
//                             return
//                         }
//                     }
//                     const request = req.body
//                     await dispatchGCloudTask(request)
//                     res.status(200).send({ result: 'Email Sent' })
//                 } else {
//                     res.status(404).send({ result: 'No Template with that name found' })
//                 }
//
//             } catch (error) {
//                 functions.logger.error('Error: ', error)
//                 res.status(500).send({ result: 'Error occured during email' })
//             }
//         } else {
//             res.status(405).end()
//         }
//
//     })
// })


// const cors = require('cors')({ origin: true })
export const sendEmail = functions.https.onRequest(async (req, res) => {
    try {
        await verifyCloudTaskRequest(req)
        const request = req.body
        await sendMail(request)
        res.status(200).send({ result: 'Email Sent' })
        // await
    } catch (error) {
        res.status(500).json({ result: error })
    }
})
// https://firebase.google.com/docs/functions/typescript

// import { google } from 'googleapis'


//
// export const createNewTeam = functions.database.ref('/teams').onCreate(async data => {
//     functions.logger.debug('RECEIVED INVOCATION', data)
//     const decrypted =  JSON.parse(getDecrypted())
//     const sheetId = '1bPwL9B_0s7VpQzgZqk9mOyXJqOwsJoTRryGt-vW8hgU'
//     const changeData = data.val()
//     const scopes = ['https://www.googleapis.com/auth/spreadsheets']
//     const googleAccount = decrypted
//     const jwt = new google.auth.JWT(
//         googleAccount.client_email,
//         undefined,
//         // we need to replace the escaped newline characters
//         // https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
//         googleAccount.private_key.replace(/\\n/g, '\n'),
//         scopes
//     )
//     const sheets = google.sheets({ version: 'v4', auth: jwt })
//     let values = [
//         [JSON.stringify(changeData)]
//     ]
//     let resource = {
//         values
//     }
//
//     await sheets.spreadsheets.values.append({
//         spreadsheetId: sheetId,
//         range: 'A2',
//         valueInputOption: 'RAW',
//         requestBody: resource
//     })
//     functions.logger.debug('WE HIT HERE')
//
// })
// export const copyTeamsToSheet = functions.database.ref('/teams').onUpdate(async change => {
//     functions.logger.debug('RECEIVED INVOCATION')
//     const decrypted =  JSON.parse(getDecrypted())
//     const sheetId = '1bPwL9B_0s7VpQzgZqk9mOyXJqOwsJoTRryGt-vW8hgU'
//     const data = change.after.val()
//     const scopes = ['https://www.googleapis.com/auth/spreadsheets']
//     const googleAccount = decrypted
//     const jwt = new google.auth.JWT(
//         googleAccount.client_email,
//         undefined,
//         // we need to replace the escaped newline characters
//         // https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
//         googleAccount.private_key.replace(/\\n/g, '\n'),
//         scopes
//     )
//     const sheets = google.sheets({ version: 'v4', auth: jwt })
//     let values = [
//         [JSON.stringify(data)]
//     ]
//     let resource = {
//         values
//     }
//
//     await sheets.spreadsheets.values.append({
//         spreadsheetId: sheetId,
//         range: 'A2',
//         valueInputOption: 'RAW',
//         requestBody: resource
//     })
//     functions.logger.debug('WE HIT HERE')
//     functions.logger.info(data, { structuredData: true })
// })