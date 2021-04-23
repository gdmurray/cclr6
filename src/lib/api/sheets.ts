import { google, sheets_v4 } from 'googleapis'


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

export async function getSheetsClient(): Promise<sheets_v4.Sheets> {
    try {
        const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
        const jwt = new google.auth.JWT(
            process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            null,
            // we need to replace the escaped newline characters
            // https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
            process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes
        )

        const sheets = google.sheets({ version: 'v4', auth: jwt })

        return Promise.resolve(sheets)
    } catch (err) {
        return Promise.reject(err)
    }
}