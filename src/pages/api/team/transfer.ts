import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@lib/api/authenticate'
import { Teams } from '@lib/models/team'
import { adminFireStore } from '@lib/firebase/admin'
import dayjs from 'dayjs'
import { getExpires } from '@lib/utils'
import { getHostName } from './invite'
import { sendMail } from '@lib/platform/mail'

// Turns existing transfers to CANCELLED
async function cancelTransfer(doc) {
    await adminFireStore.collection('transfers').doc(doc.id).update({ status: 'CANCELLED' })
}

async function getExistingTransfers(team_id: string): Promise<any> {
    const existing_transfers = await adminFireStore
        .collection('transfers')
        .where('team_id', '==', team_id)
        .where('status', '==', 'PENDING')
        .get()
    return Promise.resolve(existing_transfers)
}

export default async function transfer(req: NextApiRequest, res: NextApiResponse) {
    const user = await authenticate(req, res)
    const team = await Teams.getTeamByOwnerID(user.uid)

    if (req.method === 'POST') {
        const { team_id, email_address } = req.body
        // Is user admin
        if (team && team.id === team_id) {
            const existing_transfers = await getExistingTransfers(team_id)

            if (!existing_transfers.empty) {
                await Promise.all(existing_transfers.docs.map((doc) => cancelTransfer(doc)))
            }

            const expires = await getExpires(24)
            const newTransfer = await adminFireStore.collection('transfers').add({
                team_id,
                email_address,
                expires,
                created: dayjs().toISOString(),
                status: 'PENDING',
            })
            const transferURL = JSON.stringify({ id: newTransfer.id, expires })
            const buffer = new Buffer(transferURL)
            const hashed = buffer.toString('base64')
            const cta_url = `${getHostName()}/transfer/${encodeURI(hashed)}`
            await sendMail(email_address, 'transfer_team', {
                cta_url: cta_url,
                team_name: team.data().name,
            })
            const newTransferData = await newTransfer.get()
            res.status(200).json({
                message: 'Created Transfer',
                transfer: { id: newTransferData.id, ...newTransferData.data() },
            })
        } else {
            res.status(401).end()
        }
    } else if (req.method === 'DELETE') {
        const { team_id, transfer_id } = req.body
        console.log(req.body)
        console.log(team_id, transfer_id)
        if (team && team.id === team_id) {
            await adminFireStore.collection('transfers').doc(transfer_id).update({ status: 'CANCELLED' })
            res.status(200).json({ message: 'Transfer Request Cancelled!' })
        } else {
            res.status(401).end()
        }
    } else if (req.method === 'GET') {
        const { team_id } = req.query
        // Is user admin
        if (team && team.id === team_id) {
            console.log('Team id', team_id)
            const existing_transfers = await getExistingTransfers(team_id)
            if (existing_transfers.size > 0) {
                const transfer = existing_transfers.docs[0].data()
                console.log('Transfer: ', transfer)
                res.status(200).json({
                    message: `Transfer to ${transfer.email_address} Pending `,
                    transfer: {
                        id: existing_transfers.docs[0].id,
                        ...transfer,
                    },
                })
            } else {
                // No Transfers
                res.status(400).json({ message: 'No Transfer pending' })
            }
        } else {
            res.status(401).end()
        }
    } else {
        res.status(405).end()
    }
}
