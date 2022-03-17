import { NextApiRequest, NextApiResponse } from 'next'
import authenticate, { isAdmin } from '@lib/api/authenticate'
import { CreateTeamClient, Teams } from '@lib/models/team'
import { adminFireStore } from '@lib/firebase/admin'
import { IPlayer } from '@lib/models/player'
import { dispatchTask, RegistrationTaskType } from '@lib/platform/dispatchTask'
// import { sendMail } from '@lib/platform/mail'

export default async function upsert(req: NextApiRequest, res: NextApiResponse) {
    const user = await authenticate(req, res)
    const isAdministrator = await isAdmin(user, res)
    console.log('is Admin: ', isAdministrator)
    if (!isAdministrator) {
        console.log('NOT ADMIN, GET OUTTA HERE BOZO')
        return res.status(400).end()
    }

    const { team_id, event_name, status, participant_id } = req.body
    const team = await Teams.getTeamById(team_id)
    const teamClient = CreateTeamClient(team, adminFireStore)
    const hasRegistration = await teamClient.getRegistration(event_name)

    function getParticipantId(): { participant_id: string } | Record<string, unknown> {
        if (participant_id != null) {
            return { participant_id }
        }
        return {}
    }

    console.log(hasRegistration)
    if (hasRegistration) {
        await adminFireStore
            .collection('teams')
            .doc(team.id)
            .collection('registrations')
            .doc(hasRegistration.id)
            .update({
                status,
                ...getParticipantId(),
            })
        return res.status(200).end()
    }
    await adminFireStore
        .collection('teams')
        .doc(team.id)
        .collection('registrations')
        .add({
            status: status,
            registered: new Date().toISOString(),
            tournament_id: event_name,
            ...getParticipantId(),
        })
    return res.status(200).end()
    // if (hasRegistered) {
    //     return res.status(400).json({ status: 'failure', message: 'already registered' })
    // }
    // await teamClient.registerForTournament(event_name, '')
    // const players = await adminFireStore.collection('teams').doc(team.id).collection('players').get()
    // const playerData = players.docs.map((player) => ({
    //     id: player.id,
    //     ...(player.data() as IPlayer),
    // }))
    // await dispatchTask({
    //     type: RegistrationTaskType.TEAM_REGISTER,
    //     event: event_name,
    //     team: {
    //         id: team.id,
    //         name: team.name,
    //         contact_email: team.contact_email,
    //         paid: true,
    //         registered: true,
    //     },
    //     players: playerData,
    // })
    // if (teamClient.canSendNotification('registration')) {
    //     await sendMail(team.contact_email, 'registration', {
    //         event_name: event_name,
    //         cta_url: `https://www.toornament.com/en_US/tournaments/${qualifierId}/information`,
    //     })
    // }

    // res.status(200).json({ status: 'success', message: 'registered' })
}
