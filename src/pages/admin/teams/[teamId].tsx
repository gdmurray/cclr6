import React from 'react'
import AdminLayout from '@components/admin/layout'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { adminFireStore } from '@lib/firebase/admin'
import { ITeam } from '@lib/models/team'
import AdminEditTeam from '@components/admin/EditTeam'
import { basePlayers, Players } from '@lib/models/player'
import AdminPlayerForm from '@components/admin/AdminPlayerForm'
import { PlayerFormItem } from '@components/teams/players/usePlayerForm'
import { resetServerContext } from 'react-beautiful-dnd'

export const getServerSideProps = withAuthSSR({
    whenNotAdmin: AuthAction.REDIRECT_TO_APP,
})(async (ctx) => {
    const {
        query: { teamId },
    } = ctx
    const data = await adminFireStore.collection('teams').doc(teamId).get()
    const team = { id: data.id, ...data.data() } as ITeam

    const result = await adminFireStore.collection('teams').doc(teamId).collection('players').get()
    const indexMap = Players.getPlayerIndexMap(result)

    const players = basePlayers.map((elem, idx) => {
        if (idx in indexMap) {
            return {
                ...elem,
                ...indexMap[idx],
            }
        }
        return elem
    })

    resetServerContext()
    return {
        props: {
            team,
            players,
        },
    }
})

const AdminTeam = ({ team, players }: { team: ITeam; players: PlayerFormItem[] }) => {
    return (
        <div>
            <AdminEditTeam team={team} />
            <AdminPlayerForm players={players} team={team} />
        </div>
    )
}

AdminTeam.layout = (content: React.ReactNode): JSX.Element => {
    return <AdminLayout>{content}</AdminLayout>
}

export default AdminTeam
