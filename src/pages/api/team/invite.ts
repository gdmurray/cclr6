import { NextApiRequest, NextApiResponse } from 'next'
import { adminFireStore } from '@lib/firebase/admin'

// todo: some goddamn validation
export default async function (req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const data = req.body
    const { team_id, team_name, user_email } = data
    const now = new Date()
    now.setHours(now.getHours() + 24)
    const expires = now.toISOString()
    const createdInvitation = await adminFireStore.collection('invitations').add({
        team_id,
        team_name,
        email: user_email,
        status: 'INVITED',
        expires: now.toISOString(),
    })
    const invitationData = await createdInvitation.get()

    const invitation = {
        id: invitationData.id,
        ...invitationData.data(),
    }

    const invitationURL = JSON.stringify({ id: invitationData.id, expires })
    const buffer = new Buffer(invitationURL)
    const hashed = buffer.toString('base64')
    // const cta_url = `${getHostName()}/invitation/${encodeURI(hashed)}`

    // sendMail(user_email, 'invite', {
    //     team_name,
    //     cta_url
    // })

    res.status(200).json({ id: invitation.id })
}
