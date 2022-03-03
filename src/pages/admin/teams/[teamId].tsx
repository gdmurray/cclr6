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
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    useDisclosure,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

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

const AdminDeleteTeamForm = ({ team }: { team: ITeam }): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { back } = useRouter()
    const cancelRef = React.useRef<HTMLButtonElement>()
    const deleteTeam = () => {
        fetch(`/api/admin/team/delete`, {
            body: JSON.stringify({
                team_id: team.id,
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {
                back()
            }
        })
    }
    return (
        <div>
            <AlertDialog
                motionPreset="slideInBottom"
                isOpen={isOpen}
                onClose={onClose}
                leastDestructiveRef={cancelRef}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>Confirm Delete Team</AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody className="text-main font-normal">
                            Are you sure you want to delete <b>{team.name}</b>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" ml={3} onClick={deleteTeam}>
                                Delete Team
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Button colorScheme="red" type="button" onClick={onOpen}>
                Delete Team
            </Button>
        </div>
    )
}

const AdminTeam = ({ team, players }: { team: ITeam; players: PlayerFormItem[] }) => {
    return (
        <div>
            <AdminEditTeam team={team} />
            <AdminPlayerForm players={players} team={team} />
            <AdminDeleteTeamForm team={team} />
        </div>
    )
}

AdminTeam.layout = (content: React.ReactNode): JSX.Element => {
    return <AdminLayout>{content}</AdminLayout>
}

export default AdminTeam
