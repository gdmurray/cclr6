// eslint-disable-next-line camelcase
import {google, sheets_v4} from "googleapis";
import {googleAccount} from "./admin";
import * as functions from "firebase-functions";

const spreadsheet = "14TS5g7jHrAyuhqm70vlJwn3PQWCIyFaBP5JV4r_CFhs";

// eslint-disable-next-line camelcase
export async function getSheetsClient(): Promise<sheets_v4.Sheets> {
    try {
        const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
        const jwt = new google.auth.JWT(
            googleAccount.client_email,
            undefined,
            googleAccount.private_key.replace(/\\n/g, "\n"),
            scopes
        );

        const sheets = google.sheets({version: "v4", auth: jwt});
        return Promise.resolve(sheets);
    } catch (err) {
        console.log("ERROR GETTING SHEETS CLIENT: ", getSheetsClient());
        return Promise.reject(err);
    }
}

// eslint-disable-next-line camelcase
async function searchForTeamId(client: sheets_v4.Sheets, id: string, qualifier: string): Promise<string> {
    const lookupResponse = await client.spreadsheets.values.update({
        spreadsheetId: spreadsheet,
        range: "LOOKUP!A1",
        valueInputOption: "USER_ENTERED",
        includeValuesInResponse: true,
        requestBody: {
            range: "LOOKUP!A1",
            values: [[`=MATCH("${id}", ${qualifier}!A:A, 0)`]],
        },
    });
    return lookupResponse.data.updatedData?.values?.[0][0];
}

type Player = {
    id: string
    index: number
    uplay: string
    country: string
    email: string
    // eslint-disable-next-line camelcase
    is_captain: boolean
}
type SheetPayload = {
    type: string
    event: string
    team: {
        id: string
        name: string
        // eslint-disable-next-line camelcase
        contact_email: string
        paid: boolean
        registered: boolean
    }
    players: Player[]
}

function getRole(player: Player, index: number): string {
    if (player.is_captain) {
        return "Captain";
    }
    if (index > 4) {
        return "Substitute";
    }
    return "";
}

type PayloadOptions = {
    players: boolean
    team: boolean
}

function buildInsertPayload(
    payload: SheetPayload,
    options: PayloadOptions = {
        players: true,
        team: true,
    }
) {
    const players = [...payload.players].sort((a, b) => a.index - b.index);
    const teamPayload = [
        payload.team.id,
        payload.team.name,
        payload.team.contact_email,
        `PAID: ${payload.team.paid.toString().toUpperCase()}`,
        `REGISTERED: ${payload.team.registered.toString().toUpperCase()}`,
    ];
    const updateSheetsPayload = [];
    if (options.team) {
        updateSheetsPayload.push(teamPayload);
    }
    if (options.players) {
        for (let i = 0; i < 8; i += 1) {
            console.log("players: ", players);
            console.log(players.length);
            if (typeof players[i] !== "undefined" && i <= players.length) {
                updateSheetsPayload.push([
                    players[i].id,
                    players[i].email,
                    players[i].uplay,
                    players[i].country,
                    getRole(players[i], i),
                ]);
            } else {
                updateSheetsPayload.push(["-", "", "", "", ""]);
            }
        }
    }

    return updateSheetsPayload;
}

async function insertOrAppend(
    // eslint-disable-next-line camelcase
    client: sheets_v4.Sheets,
    teamRow: string,
    payload: SheetPayload,
    options = {
        players: true,
        team: true,
    }
) {
    if (teamRow === "#N/A") {
        console.log("Team Row Not found... insert entire thing");
        // Ignore options if new... insert team... this shouldn't be an issue though
        const insertPayload = buildInsertPayload(payload);
        const insertResponse = await client.spreadsheets.values.append({
            spreadsheetId: spreadsheet,
            range: `${payload.event.trim()}!A1`,
            valueInputOption: "USER_ENTERED",
            includeValuesInResponse: true,
            requestBody: {
                range: `${payload.event.trim()}!A1`,
                values: insertPayload,
            },
        });
        console.log(insertResponse.data.updates?.updatedData);
        return;
    } else {
        const insertPayload = buildInsertPayload(payload, options);
        let teamRowNumber = parseInt(teamRow);
        if (options.players && !options.team) {
            console.log("PLAYERS UPDATE ONLY, increment team row");
            teamRowNumber += 1;
        }
        const insertResponse = await client.spreadsheets.values.update({
            spreadsheetId: spreadsheet,
            range: `${payload.event.trim()}!A${teamRowNumber}`,
            includeValuesInResponse: true,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                range: `${payload.event.trim()}!A${teamRowNumber}`,
                values: insertPayload,
            },
        });
        console.log("Insert response: ", insertResponse);
        return;
    }
}

export async function handleSheetEvent(payload: SheetPayload) {
    const client = await getSheetsClient();
    const teamRow = await searchForTeamId(client, payload.team.id, payload.event);
    functions.logger.info("Payload:", payload.type, payload.event);
    // }
    try {
        switch (payload.type) {
        case "TEAM_UNREGISTER": {
            const teamRowNumber = parseInt(teamRow);
            const insertPayload = buildInsertPayload(payload, {
                team: true, players: false,
            });
            const insertResponse = await client.spreadsheets.values.update({
                spreadsheetId: spreadsheet,
                includeValuesInResponse: true,
                valueInputOption: "USER_ENTERED",
                range: `${payload.event}!A${teamRowNumber}`,
                requestBody: {
                    range: `${payload.event.trim()}!A${teamRowNumber}`,
                    values: insertPayload,
                },
            });
            console.log("unregister response: ", insertResponse);
            return;
        }
        case "PLAYER_UPDATE":
            await insertOrAppend(client, teamRow, payload, {team: false, players: true});
            return;
        case "TEAM_REGISTER": {
            await insertOrAppend(client, teamRow, payload);
            return;
        }
        case "TEAM_UPDATE": {
            await insertOrAppend(client, teamRow, payload, {team: true, players: false});
            return;
        }
        default:
            return;
        }
    } catch (err) {
        console.log("ERROR: ", err);
        return;
    }
}
