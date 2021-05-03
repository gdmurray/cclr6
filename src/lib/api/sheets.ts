import { google, sheets_v4 } from 'googleapis'
import decrypted from '../secret/google-account'


export enum Sheets {
    STAFF = 'staff',
    TEAMS = 'teams'
}

interface SpreadsheetQuery {
    id: string,
    range: string;
}

type SheetMap = Record<Sheets, SpreadsheetQuery>;

export const sheetMap: SheetMap = {
    [Sheets.STAFF]: {
        id: '1I3_iL3efTgV-RzdiM8JRa7VZiZ0MRS5gmokOamKYnug',
        range: 'A:D'
    },
    [Sheets.TEAMS]: {
        id: '1bPwL9B_0s7VpQzgZqk9mOyXJqOwsJoTRryGt-vW8hgU',
        range: 'A:Z'
    }
}

export async function getSheetsClient(): Promise<sheets_v4.Sheets> {
    try {
        const scopes = ['https://www.googleapis.com/auth/spreadsheets']
        const googleAccount = decrypted
        const jwt = new google.auth.JWT(
            googleAccount.client_email,
            null,
            // we need to replace the escaped newline characters
            // https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
            googleAccount.private_key.replace(/\\n/g, '\n'),
            scopes
        )

        const sheets = google.sheets({ version: 'v4', auth: jwt })

        return Promise.resolve(sheets)
    } catch (err) {
        return Promise.reject(err)
    }
}