import * as functions from "firebase-functions";
import admin from "./admin";

export function validateHeader(req: functions.https.Request) {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        return req.headers.authorization.split("Bearer ")[1];
    }
    return "";
}

export async function decodeAuthToken(authToken: string) {
    return admin
        .auth()
        .verifyIdToken(authToken)
        .then((decodedToken) => {
            return decodedToken.uid;
        })
        .catch((reason) => {
            console.log(`decodeAuthToken failed: ${reason}`);
            return undefined;
        });
}
