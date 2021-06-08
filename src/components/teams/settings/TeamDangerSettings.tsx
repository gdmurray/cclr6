import React, { useContext } from 'react'
import {
    AlertDialog, AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    Button, Input,
    useDisclosure
} from '@chakra-ui/react'
import { TeamContext } from '@components/teams/teamContext'
import { FaArrowsAltH, FaTrashAlt } from 'react-icons/fa'
import { FormControl, FormLabel } from '@chakra-ui/form-control'


const TransferTeam = (): JSX.Element => {
    const teamContext = useContext(TeamContext)
    const { team } = teamContext

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    return (
        <div className='flex flex-row w-full justify-between'>
            <div className='flex flex-row py-4'>
                <span className='text-lg mx-3 mt-1'>{<FaArrowsAltH />}</span>
                <div className='flex flex-col'>
                    <div className='font-medium text-lg text-alt'>Transfer Team</div>
                    <div className='font-normal text-sm text-alt-2 max-w-md'>Transfer the team ownership to
                        another account who will handle registration and other activities
                    </div>
                </div>
            </div>
            <div className='flex flex-col self-center'>
                <Button colorScheme='orange'>Transfer Team</Button>
                <AlertDialog isOpen={isOpen}
                             onClose={onClose}
                             leastDestructiveRef={cancelRef}
                             isCentered={true}>
                    <AlertDialogContent>
                        <AlertDialogHeader>Transfer Team</AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody>
                            <FormControl>
                                <FormLabel>Email Address</FormLabel>
                                <Input />
                            </FormControl>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button colorScheme='gray' onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red'>
                                Invite for Transfer
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

const TeamDangerSettings = () => {

    return (
        <div>
            <div className='text-subtitle'>Dangerous Settings</div>
            <div className='text-subtitle-description text-warning'>Settings that can permanently impact this team,
                use caution!
            </div>
            <div className='p-2 py-4'>

                <hr className='mx-4' />
                <div className='flex flex-row w-full justify-between'>
                    <div className='flex flex-row py-4'>
                        <span className='text-lg mx-3 mt-1'>{<FaTrashAlt />}</span>
                        <div className='flex flex-col'>
                            <div className='font-medium text-lg text-alt'>Delete Team</div>
                            <div className='font-normal text-sm text-alt-2 max-w-md'>Delete the team from the
                                website, warning: This action is non reversible.
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col self-center'>
                        <Button colorScheme='red'>Delete Team</Button>
                    </div>
                </div>
                <hr className='mx-4' />
            </div>
        </div>
    )
}

export default TeamDangerSettings