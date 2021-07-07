import React, { useState } from 'react'
import AdminLayout from '@components/admin/layout'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { ToornamentClient } from '@lib/api/toornament'
import { ITeam, Teams } from '@lib/models/team'
import { Button, Select } from '@chakra-ui/react'
import { adminFireStore } from '@lib/firebase/admin'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

export const getServerSideProps = withAuthSSR({
    whenNotAdmin: AuthAction.REDIRECT_TO_APP,
})(async () => {
    const client = new ToornamentClient()
    const tournament_id = '4585711997166354432'
    const data = await client.getParticipants(tournament_id)
    const teams = await Teams.getTeams()
    const teamData = teams.docs.map((elem) => {
        return {
            id: elem.id,
            ...elem.data(),
        }
    })

    const synced = await adminFireStore.collection('season').doc('one').collection('teams').get()
    const syncData = synced.docs.map((elem) => {
        return {
            id: elem.id,
            ...elem.data(),
        }
    })
    return {
        props: {
            teams: teamData,
            data,
            synced: syncData,
        },
    }
})

interface BaseProps {
    teams: ITeam[]
    synced: { participant_id: string; team_name: string; team_id: string }[]
}

interface SyncProps extends BaseProps {
    participant: Record<string, any>
}

function SyncComponent({ participant, teams, synced }: SyncProps) {
    const syncMap = synced.filter((elem) => elem.participant_id === participant.id)
    const isSynced = syncMap.length === 1
    const router = useRouter()

    const { register, watch } = useForm({
        defaultValues: {
            ...(synced.filter((elem) => elem.participant_id === participant.id).length === 1
                ? { team: synced.filter((elem) => elem.participant_id === participant.id)[0].team_id }
                : {}),
        },
    })

    const teamID = watch('team')
    const handleSync = async () => {
        fetch('/api/admin/toornament/sync', {
            method: 'POST',
            body: JSON.stringify({
                participant_id: participant.id,
                team_id: teamID,
                tournament_id: '4585711997166354432',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            if (res.ok) {
                router.reload()
            }
        })
    }

    return (
        <div className="flex flex-row justify-between">
            <div className="w-full text-left font-medium text-main">
                {participant.name} <span className="text-alt-2 text-sm">{teamID}</span>
            </div>
            <div className="w-full text-center">
                <Select placeholder={'Select Team'} {...register('team')}>
                    {teams.map((team) => {
                        return (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        )
                    })}
                </Select>
            </div>
            <div className="w-full text-right">
                <Button isDisabled={!teamID || isSynced} onClick={handleSync}>
                    {isSynced ? 'Team Synced' : 'Sync Team'}
                </Button>
            </div>
        </div>
    )
}

interface AdminSyncProps extends BaseProps {
    data: Record<string, any>[]
}

const AdminSync = ({ teams, data, synced }: AdminSyncProps) => {
    return (
        <div>
            <div className="space-y-2 flex flex-col">
                {data.map((participant) => {
                    return (
                        <SyncComponent key={participant.id} participant={participant} teams={teams} synced={synced} />
                    )
                })}
            </div>
        </div>
    )
}

AdminSync.layout = (content: React.ReactNode): JSX.Element => {
    return <AdminLayout>{content}</AdminLayout>
}
export default AdminSync
