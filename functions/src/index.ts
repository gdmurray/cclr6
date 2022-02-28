import * as functions from "firebase-functions";
import {sendMail, verifyCloudTaskRequest} from "./tasks";
import * as admin from "firebase-admin";
import {handleSheetEvent} from "./sheets";

const firestoreClient = new admin.firestore.v1.FirestoreAdminClient();

export const sendEmail = functions.https.onRequest(async (req, res) => {
    try {
        if (process.env.FUNCTIONS_EMULATOR !== "true") {
            await verifyCloudTaskRequest(req, "sendEmail");
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

export const updateTeamRegistrationSheet = functions.https.onRequest(async (req, res) => {
    try {
        if (process.env.FUNCTIONS_EMULATOR !== "true") {
            await verifyCloudTaskRequest(req, "updateTeamRegistrationSheet");
        }
        const request = req.body;
        functions.logger.info("Team Registration Event");
        await handleSheetEvent(request);
        res.status(200).end();
    } catch (error) {
        functions.logger.error(error);
        res.status(500).json({result: error}).end();
    }
});

export const scheduledFirestoreExport = functions.pubsub.schedule("every 12 hours").onRun((context) => {
    const bucket = "gs://ccl-content.appspot.com";
    const projectId = "ccl-content";

    const databaseName = firestoreClient.databasePath(projectId, "(default)");

    return firestoreClient
        .exportDocuments({
            name: databaseName,
            outputUriPrefix: bucket,
            collectionIds: [],
        })
        .then((responses) => {
            const response = responses[0];
            functions.logger.info(`Operation Name: ${response["name"]}`);
        })
        .catch((err) => {
            functions.logger.error(`Export operation failed: ${err}`);
            throw new Error("Export Operation Failed");
        });
});
