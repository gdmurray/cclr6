import * as functions from 'firebase-functions'
// import * as path from 'path'
import admin from './admin'
import { decodeAuthToken, validateHeader } from './utils'

const templates = [
    'forgot_password',
    'invite',
    'registration',
    'verify'
]

const cors = require('cors')({ origin: true })

export const triggerEmail = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const authToken = validateHeader(req)
            if (!authToken) {
                res.status(403).send('Not authorized. Missing auth Token')
            }

            const uid = await decodeAuthToken(authToken)
            if (uid === undefined) {
                res.status(403).send('Invalid or expired token.')
                return
            }

            res.status(200).send({ result: 'Email Sent' })
        } catch (error) {
            console.log(`Error occured during account update: ${error}`)
            res.status(500).send({ result: 'Error occured during email' })
        }
    })
})

// const cors = require('cors')({ origin: true })

// const noAuthTemplates = ['forgot_password']
exports.sendEmail = functions.https.onRequest(async (req, res) => {
    try {
        if (req.method === 'POST') {
            const { template } = req.body
            if (templates.indexOf(template) !== -1) {
                const authToken = req.headers.authorization?.replace('Bearer ', '')
                if (authToken) {
                    const user = await admin.auth().verifyIdToken(authToken)
                    res.statusCode = 200
                    res.json({ message: user })
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
                res.statusCode = 400
                res.json({ message: 'invalid template' })
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
            res.statusCode = 200
            res.json({ message: 'sent' })
        } else {
            res.status(405).end()
        }
    } catch (e) {
        console.log('man how did i get here')
        console.log(e)
        res.statusCode = 500
        res.json({ e })
    }

    // })
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