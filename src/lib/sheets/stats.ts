import { getSheetsClient } from '@lib/api/sheets'
import { sheets_v4 } from 'googleapis'
import { MapStatsForm, MatchStatsSchema } from '@components/analyst/match/use-match-form'
import { ITeam } from '@lib/models/team'
import { formatStatsValue, headerValues } from '@components/analyst/match'

const spreadsheetId = '12vyxd7LOM5KiBExSr2w3GS5Obc8jk_v58O053B4J09k'

async function searchForStatSheet(client: sheets_v4.Sheets) {
    const sheets = await client.spreadsheets.get({
        spreadsheetId,
    })
    const results = sheets.data.sheets.map((sheet) => {
        return {
            title: sheet.properties.title,
            index: sheet.properties.index,
            id: sheet.properties.sheetId,
        }
    })
    console.log(results)
    return results
}

async function addSheet(client: sheets_v4.Sheets, sheetName: string) {
    const result = await client.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [{ addSheet: { properties: { title: sheetName } } }],
        },
    })
    console.log(result.status === 200)
    return
}

function getTeamName(i: number, team: ITeam): string {
    if (i === 0) {
        return team.name.toUpperCase()
    }
    return ''
}

function getMapName(i: number, mapResults: MapStatsForm): string {
    if (i === 0) {
        return mapResults.map_name.toUpperCase()
    }
    return ''
}

function getScore(i: number, score: string | number) {
    if (i === 0) {
        return `${score}`
    }
    return ''
}

export async function updateStatSheets(stats: MatchStatsSchema, teamOne: ITeam, teamTwo: ITeam) {
    const client = await getSheetsClient()

    const currentSheets = await searchForStatSheet(client)
    for (let i = 0; i < stats.maps.length; i += 1) {
        const mapResults = stats.maps[i]
        const sheetName = `${teamOne.slug}_${teamTwo.slug}_map_${i + 1}`
        console.log('Map sheet name: ', sheetName)
        if (!currentSheets.map((sheet) => sheet.title).includes(sheetName)) {
            console.log('SHEET DOESNT EXIST, CREATING')
            await addSheet(client, sheetName)
        }
        const payload = [['map', 'team', 'score', ...headerValues]]

        for (let i = 0; i < mapResults.team_one_players.length; i += 1) {
            const player = mapResults.team_one_players[i]
            const row = [
                getMapName(i, mapResults),
                getTeamName(i, teamOne),
                getScore(i, mapResults.team_one_score),
                ...headerValues.map((key) => formatStatsValue(key, player[key])),
            ]
            payload.push(row)
        }
        for (let i = 0; i < mapResults.team_two_players.length; i += 1) {
            const player = mapResults.team_two_players[i]
            const row = [
                '',
                getTeamName(i, teamTwo),
                getScore(i, mapResults.team_two_score),
                ...headerValues.map((key) => formatStatsValue(key, player[key])),
            ]
            payload.push(row)
        }
        const insertResponse = await client.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                range: `${sheetName}!A1`,
                values: payload,
            },
        })
        console.log('INSERT RESPONSE: ', insertResponse)
    }
    return Promise.resolve()
    // const sheetExists = await
}
