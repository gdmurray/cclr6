import * as nodemailer from "nodemailer";
// @ts-ignore
import Email from "email-templates";
import * as path from "path";
import * as aws from "aws-sdk";
import * as functions from "firebase-functions";
import {Transporter} from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import SESTransport from "nodemailer/lib/ses-transport";

const base64ToS3 = require("nodemailer-base64-to-s3");

aws.config.update({
    accessKeyId: functions.config().aws.id,
    secretAccessKey: functions.config().aws.secret,
    region: "us-east-1",
});

// <SMTPTransport.SentMessageInfo
// <SESTransport.SentMessageInfo
const ses = new aws.SES({
    apiVersion: "2010-12-01",
    region: "us-east-1",
});

function getTransport(): Transporter<SMTPTransport.SentMessageInfo | SESTransport.SentMessageInfo> {
    if (process.env.FUNCTIONS_EMULATOR !== "true") {
        functions.logger.info("Using SES transport");
        return nodemailer.createTransport({
            SES: {ses, aws},
        });
    }

    functions.logger.info("Using Mailtrap transport");
    return nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: functions.config().mailtrap.user,
            pass: functions.config().mailtrap.pass,
        },
    });
}

export const transporter = getTransport();

transporter.use(
    "compile",
    base64ToS3({
        aws: {
            accessKeyId: functions.config().aws.id,
            secretAccessKey: functions.config().aws.secret,
            params: {
                Bucket: "cclr6",
            },
        },
    })
);

export const getEmail = (from = "noreply@cclr6.com"): Email => {
    return new Email({
        juice: true,
        juiceResources: {
            preserveMediaQueries: true,
            preserveImportant: true,
            webResources: {
                relativeTo: path.resolve("src/email"),
                images: true,
            },
        },
        message: {
            from,
        },
        preview: false,
        // preview: process.env.FUNCTION_EMULATOR === 'true',
        send: true, // process.env.FUNCTIONS_EMULATOR !== 'true',
        transport: transporter,
        subjectPrefix: process.env.FUNCTIONS_EMULATOR !== "true" ? "CCLR6: " : "DEVCCL: ",
    });
};
