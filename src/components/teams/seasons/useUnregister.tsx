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
    useToast,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useRouter } from 'next/router'

export function useUnregister({ team, qualifier, status }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isUnregistering, setIsUnregistering] = useState<boolean>(false)
    const cancelRef = React.useRef<HTMLButtonElement>()
    const toast = useToast({ position: 'top-right', duration: 2000, variant: 'solid' })
    const router = useRouter()

    const canUnregister = (): boolean => {
        return (
            dayjs(qualifier.registration_closing_datetime).diff(dayjs(), 'minutes') > 30 &&
            status.button === 'Registered'
        )
    }

    const [isHovering, setIsHovering] = useState<boolean>(false)

    const handleHover = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const { type } = e
        if (type === 'mouseenter') {
            if (!isHovering) {
                setIsHovering(true)
            }
        } else if (type === 'mouseleave') {
            if (isHovering) {
                setIsHovering(false)
            }
        }
    }

    const unregister = () => {
        setIsUnregistering(true)
        fetch(`/api/qualifier/${qualifier.id}/unregister`, {
            method: 'POST',
            body: JSON.stringify({
                team_id: team.id,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((result) => {
            if (result.ok) {
                setIsUnregistering(false)
                onClose()
                toast({
                    status: 'info',
                    title: `Unregistered for ${qualifier.name}`,
                    onCloseComplete: () => {
                        router.reload()
                    },
                })
            } else {
                console.log('failed')
                setIsUnregistering(false)
                onClose()
                toast({
                    status: 'error',
                    title: 'There was an error unregistering',
                })
            }
        })
        // onClose()
    }
    const UnregisterDialog = (): JSX.Element => (
        <AlertDialog
            motionPreset="slideInBottom"
            isOpen={isOpen}
            onClose={onClose}
            leastDestructiveRef={cancelRef}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader>Confirm Unregister</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody className="text-main font-normal">
                        Are you sure you want to unregister for <b>{qualifier.name}</b>,&nbsp; taking place on{' '}
                        <b>{dayjs(qualifier.scheduled_date_start).format('LL')}</b>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button isLoading={isUnregistering} colorScheme="red" ml={3} onClick={unregister}>
                            Unregister
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
    return {
        UnregisterDialog,
        canUnregister,
        hover: {
            handleHover,
            isHovering,
        },
        onUnregisterOpen: onOpen,
    }
}
