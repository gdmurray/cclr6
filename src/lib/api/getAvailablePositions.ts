import { getSheetsClient, sheetMap, Sheets } from './sheets'

export async function getAvailablePositions() {
    const sheetClient = await getSheetsClient()
    console.log('GOT SHEET CLIENT')
    const spreadsheet = sheetMap[Sheets.STAFF]
    try {

        const response = await sheetClient.spreadsheets.values.get({
            spreadsheetId: spreadsheet.id,
            range: 'Test!A:D'
        })

        const rows = response.data.values
        if (rows.length > 0) {
            const headers = rows[0]
            return rows.slice(1).map((row) => {
                return headers.reduce((acc, val, idx) => {
                    if (val.toLowerCase() === 'active') {
                        acc[val.toLowerCase()] = JSON.parse(row[idx].toLowerCase())
                    } else {
                        acc[val.toLowerCase()] = row[idx]
                    }
                    return acc
                }, {})
            })
        }
        return []
    } catch (err) {
        console.log(err)
    }

    return []
}