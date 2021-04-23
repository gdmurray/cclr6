import { google, sheets_v4 } from 'googleapis'
import { GOOGLE_DATA } from '../config'
import { decrypt } from '../crypto'


export enum Sheets {
    STAFF = 'staff'
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
    }
}

export const loadGoogleAccount = () => {
    const encodedData = GOOGLE_DATA
    if (encodedData) {
        const decodedData = decrypt(encodedData)
        return JSON.parse(decodedData)
    }
}

export async function getSheetsClient(): Promise<sheets_v4.Sheets> {
    try {
        const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
        const googleAccount = loadGoogleAccount()
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