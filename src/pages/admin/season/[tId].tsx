import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import AdminLayout from '@components/admin/layout'
import { adminFireStore } from '@lib/firebase/admin'
import Table from 'rc-table'
import { getQueryKeyMap } from '@lib/utils'
import { IRegistration, ITeam } from '@lib/models/team'
import { Button, useToast } from '@chakra-ui/react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import React from 'react'
import { useRouter } from 'next/router'

interface TeamRegistrations extends ITeam {
    registered: boolean
    registration: IRegistration
}

export const getServerSideProps = withAuthSSR({
    whenNotAdmin: AuthAction.REDIRECT_TO_APP,
})(async (ctx) => {
    const {
        query: { tId },
    } = ctx
    const registrations = await adminFireStore.collectionGroup('registrations').where('tournament_id', '==', tId).get()

    const teams = await adminFireStore.collection('teams').get()

    // const registrationMap = getQueryKeyMap(registrations.docs)

    const registrationMap = registrations.docs.reduce((acc, doc) => {
        const teamId = doc.ref.path.split('/')[1]
        acc[teamId] = {
            id: doc.id,
            ...doc.data(),
        }
        return acc
    }, {})
    // console.log(registrationMap)
    const registeredTeams = registrations.docs.map((doc) => doc.ref.path.split('/')[1])

    const teamMap = teams.docs.reduce((acc: Record<string, Partial<TeamRegistrations>>, team) => {
        let body: Partial<TeamRegistrations> = {
            id: team.id,
            registered: false,
            ...team.data(),
        }
        if (registeredTeams.indexOf(team.id) !== -1) {
            body = {
                ...body,
                registered: true,
                registration: {
                    ...registrationMap[team.id],
                },
            }
        }
        acc[team.id] = body
        return acc
    }, {})

    const teamData = Object.values(teamMap)
    return {
        props: {
            data: teamData,
        },
    }
})

const AdminTournament = ({ data }): JSX.Element => {
    const router = useRouter()
    const { tId } = router.query as { tId: string }
    const toast = useToast({ position: 'top-right', duration: 2000, variant: 'solid' })

    const handleRegister = async (team_id, tournament_id) => {
        fetch(`/api/admin/qualifier/register`, {
            method: 'POST',
            body: JSON.stringify({
                team_id: team_id,
                event_name: tournament_id,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((result) => {
            result.json().then((data) => {
                console.log('DATA: ', data)
                if (data.status === 'success') {
                    toast({
                        title: `Registered for ${tId}`,
                        status: 'success',
                        onCloseComplete: () => {
                            // router.reload()
                        },
                    })
                }
            })
        })
    }
    const columns = [
        {
            title: 'Team Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'registered',
            dataIndex: 'registered',
            key: 'registered',
            render: (registered: boolean): JSX.Element => {
                if (registered) {
                    return <FaCheck className="text-success" />
                } else {
                    return <FaTimes className="text-warning" />
                }
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => {
                if (!record.registered)
                    return (
                        <Button type="button" onClick={() => handleRegister(record.id, tId)}>
                            Register
                        </Button>
                    )
            },
        },
    ]
    return (
        <div>
            <Table rowKey={(record) => record.id} className="data-table" columns={columns} data={data} />
        </div>
    )
}

AdminTournament.layout = (content: React.ReactNode): JSX.Element => {
    return <AdminLayout>{content}</AdminLayout>
}

export default AdminTournament
