import {getSheetsClient, sheetMap, Sheets} from "./sheets";

export async function getAvailablePositions() {
    const sheetClient = await getSheetsClient();
    const spreadsheet = sheetMap[Sheets.STAFF];
    try {

        const response = await sheetClient.spreadsheets.values.get({
            spreadsheetId: spreadsheet.id,
            range: spreadsheet.range
        });

        const rows = response.data.values;
        if (rows.length > 0) {
            const headers = rows[0]
            return rows.slice(1).map((row) => {
                const position = headers.reduce((acc, val, idx) => {
                    if (val.toLowerCase() === "active") {
                        acc[val.toLowerCase()] = JSON.parse(row[idx].toLowerCase());
                    } else {
                        acc[val.toLowerCase()] = row[idx];
                    }
                    return acc;
                }, {})
                if (position.active) {
                    return position
                }

            })
        }
        return []
    } catch (err) {
        console.log(err);
    }

    return [];
}