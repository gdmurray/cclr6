import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import AdminLayout from '@components/admin/layout'
import { adminFireStore } from '@lib/firebase/admin'
import { Table } from 'antd'
// import { getQueryKeyMap } from '@lib/utils'
import { IRegistration, ITeam } from '@lib/models/team'
import {
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Button,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { FaCheck, FaTimes, FaChevronDown } from 'react-icons/fa'
import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import { ColumnsType } from 'antd/es/table'
import { createFilters } from '@lib/utils'
import { Season, SeasonTwoSplit1 } from '@lib/season'
import { Tournament } from '@lib/models/tournament'
import { useForm } from 'react-hook-form'
import { FormControl, FormLabel } from '@chakra-ui/form-control'

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

    const seasonMap = [SeasonTwoSplit1].reduce((acc, elem) => {
        delete elem.WEEK_FORMATTER
        delete elem.BASE_MATCH
        acc[elem.id] = elem
        for (const qual of elem.qualifiers) {
            acc[qual.id] = qual
        }
        return acc
    }, {})

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
            seasons: seasonMap,
            data: teamData,
        },
    }
})

type ActionProps = {
    tournament_id: string
    team: AdminRegistration
}

const SyncToornamentAction = ({ tournament_id, team }: ActionProps): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef(null)
    const toast = useToast({ position: 'top-right', duration: 2000, variant: 'solid' })

    const onConfirm = () => {
        fetch('/api/admin/toornament/sync', {
            method: 'POST',
            body: JSON.stringify({
                team_id: team.id,
                tournament_id: tournament_id,
                participant_id: team.registration.participant_id,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((result) => {
            if (result.ok) {
                toast({
                    title: `Synced team data for tournament`,
                    status: 'success',
                    onCloseComplete: () => {
                        onClose()
                    },
                })
            }
        })
    }

    return (
        <MenuItem onClick={onOpen}>
            Sync with Toornament
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Sync Team Information
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Sync team data for team {team.name} and participant id: {team.registration.participant_id}{' '}
                            with whats registered in toornament
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={onConfirm} ml={3}>
                                Sync
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </MenuItem>
    )
}

const MarkAsAction = ({ tournament_id, team }: ActionProps): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { register, handleSubmit } = useForm({
        defaultValues: {
            team_id: team.id,
            participant_id: team.registration?.participant_id,
            status: 'INVITED',
        },
    })
    const cancelRef = useRef(null)
    const toast = useToast({ position: 'top-right', duration: 2000, variant: 'solid' })
    const router = useRouter()
    const onSubmit = (values) => {
        console.log('Values: ', values)
        fetch('/api/admin/qualifier/upsert', {
            method: 'POST',
            body: JSON.stringify({
                event_name: tournament_id,
                team_id: values.team_id,
                status: values.status,
                participant_id: values.participant_id,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((result) => {
            if (result.ok) {
                toast({
                    title: `Marked team ${team.name} as ${values.status} for ${tournament_id}`,
                    status: 'success',
                    onCloseComplete: () => {
                        onClose()
                        router.replace(router.asPath)
                    },
                })
            }
        })
    }

    return (
        <MenuItem onClick={onOpen}>
            Mark as...
            <Modal isOpen={isOpen} onClose={onClose} colorScheme="gray">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Registration</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalBody>
                            <FormControl>
                                <FormLabel>Team Id</FormLabel>
                                <Input {...register('team_id', { value: team.id })} isReadOnly={true} type="text" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Participant Id</FormLabel>
                                <Input {...register('participant_id')} type={'text'} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Status</FormLabel>
                                <Select {...register('status')}>
                                    <option value="INVITED">Invited</option>
                                    <option value="QUALIFIED">Qualified</option>
                                </Select>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" colorScheme="blue" mr={4}>
                                Upsert
                            </Button>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </MenuItem>
    )
}

type AdminRegistration = IRegistration & {
    name: string
    registration?: IRegistration
}
const AdminTournament = ({
    data,
    seasons,
}: {
    data: AdminRegistration[]
    seasons: Record<string, Tournament | Season>
}): JSX.Element => {
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
                    })
                }
            })
        })
    }

    const handleSheet = async (team_id, tournament_id) => {
        fetch(`/api/admin/qualifier/sheet`, {
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
                        title: `Unregistered for ${tId}`,
                        status: 'success',
                    })
                }
            })
        })
    }

    const handleUnregister = async (team_id, tournament_id) => {
        fetch(`/api/admin/qualifier/unregister`, {
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
                        title: `Unregistered for ${tId}`,
                        status: 'success',
                    })
                }
            })
        })
    }

    const columns: ColumnsType<AdminRegistration> = [
        {
            title: 'Team Name',
            dataIndex: 'name',
            key: 'name',
            ...createFilters<AdminRegistration>(data, 'name', { filterSearch: true }),
        },
        {
            title: 'Contact',
            dataIndex: 'contact_email',
            key: 'contact_email',
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
            title: 'qualified',
            dataIndex: 'qualified',
            key: 'qualifier',
            render: (_, record): JSX.Element => {
                if (record.registration && record.registration.status === 'QUALIFIED') {
                    return <FaCheck className="text-success" />
                } else {
                    return <FaTimes className="text-warning" />
                }
            },
        },
        {
            title: 'slug',
            dataIndex: 'slug',
            key: 'slug',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => {
                return (
                    <Menu>
                        <MenuButton as={Button} rightIcon={<FaChevronDown />}>
                            Actions
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => router.push(`/admin/teams/${record.id}`)}>Edit Team</MenuItem>
                            <MarkAsAction tournament_id={tId} team={record} />
                            {!record.registered && (
                                <MenuItem onClick={() => handleRegister(record.id, tId)}>Register</MenuItem>
                            )}
                            {record.registered && (
                                <MenuItem onClick={() => handleUnregister(record.id, tId)}>Unregister</MenuItem>
                            )}
                            {record.registration?.participant_id != null && (
                                <SyncToornamentAction tournament_id={tId} team={record} />
                            )}
                            <MenuItem onClick={() => handleSheet(record.id, tId)}>Test sheet</MenuItem>
                        </MenuList>
                    </Menu>
                )
            },
        },
    ]
    return (
        <div>
            <div className="page-title-sm">{seasons[tId].name}</div>
            <Table
                pagination={{ pageSize: 100 }}
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={[...data].sort((a, b) => Number(b.registered) - Number(a.registered))}
            />
        </div>
    )
}

AdminTournament.layout = (content: React.ReactNode): JSX.Element => {
    return <AdminLayout>{content}</AdminLayout>
}

export default AdminTournament
