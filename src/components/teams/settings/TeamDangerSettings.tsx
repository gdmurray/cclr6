import React, { useContext, useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    Button,
    Input,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { TeamContext } from '@components/teams/teamContext'
import { FaArrowsAltH, FaInfoCircle, FaTrashAlt } from 'react-icons/fa'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Transfer } from '@lib/models/transfer'
import { useForm } from 'react-hook-form'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'

dayjs.extend(LocalizedFormat)

const TransferTeam = (): JSX.Element => {
    const teamContext = useContext(TeamContext)
    const { team } = teamContext
    const toast = useToast({ variant: 'solid', position: 'top-right' })
    const [loading, setLoading] = useState<boolean>(true)
    const [transferData, setTransferData] = useState<Transfer>(null)
    const [status, setStatus] = useState<string>(null)

    useEffect(() => {
        console.log('Fetching...')
        fetch(`/api/team/transfer?team_id=${team.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            setLoading(false)
            if (response.ok) {
                response.json().then((res) => {
                    const { transfer } = res
                    setStatus(
                        `Transfer to ${transfer.email_address} is pending, expires on ${dayjs(transfer.expires).format(
                            'LLL'
                        )}`
                    )
                    setTransferData(transfer)
                })
            }
        })
    }, [team.id])

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    const { register, handleSubmit } = useForm()

    const onCancel = () => {
        setLoading(true)
        if (transferData) {
            console.log(transferData)
            fetch('/api/team/transfer', {
                method: 'DELETE',
                body: JSON.stringify({
                    transfer_id: transferData.id,
                    team_id: transferData.team_id,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                setLoading(false)
                if (response.ok) {
                    response.json().then((res) => {
                        const { message } = res
                        onClose()
                        toast({
                            status: 'info',
                            title: message,
                            duration: 2500,
                        })
                        setStatus(null)
                        setTransferData(null)
                    })
                }
            })
        }
    }

    const onCreate = (email_address: string) => {
        setLoading(true)
        fetch('/api/team/transfer', {
            method: 'POST',
            body: JSON.stringify({
                email_address: email_address,
                team_id: team.id,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            setLoading(false)
            if (response.ok) {
                response.json().then((res) => {
                    const { message, transfer } = res
                    onClose()
                    toast({
                        status: 'success',
                        title: message,
                    })
                    setStatus(
                        `Transfer to ${transfer.email_address} is pending, expires on ${dayjs(transfer.expires).format(
                            'LLL'
                        )}`
                    )
                    setTransferData(transfer)
                })
            }
        })
    }

    const onSubmit = (values) => {
        onCreate(values.email_address)
    }

    const onResend = () => {
        if (transferData) {
            onCreate(transferData.email_address)
        }
    }

    return (
        <>
            <div className="flex flex-row w-full justify-between">
                <div className="flex flex-row py-4">
                    <span className="text-lg mx-3 mt-1">{<FaArrowsAltH />}</span>
                    <div className="flex flex-col">
                        <div className="font-medium text-lg text-alt">Transfer Team</div>
                        <div className="font-normal text-sm text-alt-2 max-w-md">
                            Transfer the team ownership to another account who will handle registration and other
                            activities
                        </div>
                        {status && <div className="font-medium text-sm text-warning">{status}</div>}
                    </div>
                </div>
                <div className="flex flex-col self-center">
                    <Button colorScheme="orange" isLoading={loading} onClick={onOpen}>
                        {transferData ? <>Manage Transfer</> : <>Transfer Team</>}
                    </Button>
                    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef} isCentered={true}>
                        <AlertDialogContent>
                            <AlertDialogHeader>Transfer Team</AlertDialogHeader>
                            <AlertDialogCloseButton />
                            {transferData ? (
                                <>
                                    <AlertDialogBody textAlign="center" className="space-y-6">
                                        <div className="text-alt font-medium text-sm flex flex-row items-center">
                                            <FaInfoCircle />
                                            &nbsp;These will render the previous transfer requests invalid
                                        </div>
                                    </AlertDialogBody>
                                    <AlertDialogFooter>
                                        <Button onClick={onResend} colorScheme="red" isLoading={loading} mr={4}>
                                            Re-Send Request
                                        </Button>
                                        <Button colorScheme="yellow" onClick={onCancel}>
                                            Cancel Request
                                        </Button>
                                    </AlertDialogFooter>
                                </>
                            ) : (
                                <>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <AlertDialogBody>
                                            <FormControl isRequired={true}>
                                                <FormLabel>Email Address</FormLabel>
                                                <Input
                                                    name="email_address"
                                                    type="email"
                                                    {...register('email_address')}
                                                />
                                            </FormControl>
                                        </AlertDialogBody>
                                        <AlertDialogFooter>
                                            <Button colorScheme="gray" onClick={onClose} mr={4}>
                                                Cancel
                                            </Button>
                                            <Button colorScheme="red" type="submit" isLoading={loading}>
                                                Invite for Transfer
                                            </Button>
                                        </AlertDialogFooter>
                                    </form>
                                </>
                            )}
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            <hr className="mx-4" />
        </>
    )
}

const DeleteTeam = (): JSX.Element => {
    return (
        <>
            <div className="flex flex-row w-full justify-between">
                <div className="flex flex-row py-4">
                    <span className="text-lg mx-3 mt-1">{<FaTrashAlt />}</span>
                    <div className="flex flex-col">
                        <div className="font-medium text-lg text-alt">Delete Team</div>
                        <div className="font-normal text-sm text-alt-2 max-w-md">
                            Delete the team from the website, warning: This action is non reversible.
                        </div>
                    </div>
                </div>
                <div className="flex flex-col self-center">
                    <div className="text-error font-medium text-sm text-right">Contact support to delete team</div>
                </div>
            </div>
            <hr className="mx-4" />
        </>
    )
}

const TeamDangerSettings = () => {
    return (
        <div>
            <div className="text-subtitle">Dangerous Settings</div>
            <div className="text-subtitle-description text-warning">
                Settings that can permanently impact this team, use caution!
            </div>
            <div className="p-2 py-4">
                <TransferTeam />
                <DeleteTeam />
            </div>
        </div>
    )
}

export default TeamDangerSettings
