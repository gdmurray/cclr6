import * as functions from 'firebase-functions'
// import * as path from 'path'
import admin from './admin'

const templates = [
    'forgot_password',
    'invite',
    'registration',
    'verify'
]

// const noAuthTemplates = ['forgot_password']
export const sendEmail = functions.https.onRequest(async (req, res) => {
    if (process.env.FUNCTIONS_EMULATOR) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001')
    } else {
        res.setHeader('Access-Control-Allow-Origin', 'https://cclr6.com')
    }
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'POST')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        res.setHeader('Access-Control-Max-Age', '3600')
    } else if (req.method === 'POST') {
        const { template } = req.body
        if (templates.indexOf(template) !== -1) {
            const authToken = req.headers.authorization?.replace('Bearer ', '')
            if (authToken) {
                const user = await admin.auth().verifyIdToken(authToken)
                res.status(200).json({ message: { user } })
            }
            // if (noAuthTemplates.indexOf(template) === -1) {
            //     console.log('Template needs auth')
            //     const authToken = cookies.token
            //     console.log(authToken)
            //     const user = await firebaseAdmin.auth().verifyIdToken(authToken)
            //     if (user) {
            //         console.log('Valid User: ', user)
            //     } else {
            //         res.status(403).end()
            //     }
            // } else {
            //     console.log('template doesnt need auth')
            // }
        } else {
            res.status(400).json({ status: 'failed', 'message': 'Not a valid template' })
        }

        // const { template, variables, emailAddress } = req.body
        // try {
        //     const email = getEmail()
        //     email.send({
        //         template: path.resolve(`src/email/${template}`),
        //         message: {
        //             to: emailAddress
        //         },
        //         locals: variables
        //     })
        // } catch (err) {
        //     res.status(500).json({ message: err.message })
        // }

        res.status(200).json({ message: 'Sent' })
    } else {
        res.status(405).end()
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