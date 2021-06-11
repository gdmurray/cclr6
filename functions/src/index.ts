import * as functions from "firebase-functions";
import {sendMail, verifyCloudTaskRequest} from "./tasks";
import * as firestore from "@google-cloud/firestore";
const firestoreClient = new firestore.v1.FirestoreAdminClient();

export const sendEmail = functions.https.onRequest(async (req, res) => {
    try {
        if (process.env.FUNCTIONS_EMULATOR !== "true") {
            await verifyCloudTaskRequest(req);
        }
        const request = req.body;
        functions.logger.info(request);
        await sendMail(request);
        res.status(200).send({result: "Email Sent"});
        // await
    } catch (error) {
        res.status(500).json({result: error});
    }
});

export const scheduledFirestoreExport = functions.pubsub.schedule("every 12 hours").onRun((context) => {
    const bucket = "gs://ccl-content.appspot.com";
    const projectId = "ccl-content";

    const databaseName = firestoreClient.databasePath(projectId, "(default)");

    return firestoreClient.exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        collectionIds: [],
    }).then((responses) => {
        const response = responses[0];
        functions.logger.info(`Operation Name: ${response["name"]}`);
    }).catch((err) => {
        functions.logger.error(`Export operation failed: ${err}`);
        throw new Error("Export Operation Failed");
    });
});
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
