import React from 'react'
import { AuthAction, Referral, withAuthSSR } from '@lib/withSSRAuth'
import { Invitation as IInvitation } from '@lib/models/invitations'
import dayjs from 'dayjs'
import db, { FieldValue } from '@lib/firestore'

import EmptyState from '@components/EmptyState'
import { FaExclamationTriangle, FaRegCalendarTimes } from 'react-icons/fa'
import { Button, Image, useToast } from '@chakra-ui/react'
import { ITeam } from '@lib/models/team'
import { useRouter } from 'next/router'
import { useAuth } from '@lib/auth'

/*
    3. Possible States
    1. Invalid Invite => Link couldn't be parsed
        a. Not For You
        b. Could not be found
    2. Invite Expired
        a. expiry date passed
        b. Redeemed
    3. Valid
        a. Invite is valid, lets get it

 */

enum InvitationState {
    INVALID = 'INVALID',
    EXPIRED = 'EXPIRED'
}

// todo: idk what to do if the user already has a team

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_APP,
    appPageURL: '/register',
    referral: Referral.RESOLVED
})(async (context) => {
    const { query: { invitationId }, user } = context
    try {
        const decoded = Buffer.from(decodeURI(invitationId), 'base64').toString()
        const { id, expires } = JSON.parse(decoded)
        const expired = dayjs() >= dayjs(expires)
        if (expired) {
            return {
                props: {
                    error: {
                        status: InvitationState.EXPIRED,
                        message: 'Invitation has expired'
                    },
                    invitation: null
                }
            }
        } else {
            const invitation = await db.collection('invitations').doc(id)
            const invitationData = await invitation.get()
            if (!invitationData.exists) {
                return {
                    props: {
                        error: {
                            status: InvitationState.INVALID,
                            message: 'Invalid Invite'
                        }
                    }
                }
            }
            const data = { id, ...invitationData.data() } as IInvitation
            const getTeam = await db.collection('teams').doc(data.team_id)
            const teamData = await getTeam.get()
            if (!teamData.exists) {
                return {
                    props: {
                        error: {
                            status: InvitationState.INVALID,
                            message: 'Invalid Invite'
                        }
                    }
                }
            }

            const team = {
                id: data.team_id,
                ...teamData.data()
            } as ITeam


            if (user.email !== data.email) {
                return {
                    props: {
                        error: {
                            status: InvitationState.INVALID,
                            message: 'Invalid Invite'
                        }
                    }
                }
            }
            if (data.status === 'ACCEPTED' || data.status === 'DECLINED') {
                return {
                    props: {
                        error: {
                            status: InvitationState.EXPIRED,
                            message: 'Invitation has expired'
                        }
                    }
                }
            }
            if (data.status === 'INVITED') {
                return {
                    // props: {
                    //     error: {
                    //         status: InvitationState.EXPIRED,
                    //         message: 'Invitation has expired'
                    //     }
                    // }
                    props: {
                        error: null,
                        invitation: {
                            ...data,
                            team_logo: team.logo
                        }
                    }
                }
            }
        }
    } catch (e) {
        return {
            props: {
                error: {
                    status: InvitationState.INVALID,
                    message: 'Invalid Invite'
                }
            }
        }
    }
})


const Invitation = ({ invitation, error, user }): JSX.Element => {
    const router = useRouter()
    const toast = useToast({ position: 'top-right', duration: 2000, variant: 'solid' })

    const acceptInvite = async () => {
        const result = await fetch('/api/invitation/accept', {
            method: 'POST',
            body: JSON.stringify({
                user_id: user.uid,
                user_email: user.email,
                ...invitation
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (result.ok) {
            toast({
                title: `Successfully joined ${invitation.team_name}`,
                status: 'success',
                onCloseComplete: () => {
                    router.push('/')
                }
            })

        } else {
            toast({
                title: `Could not join team`,
                status: 'error',
                onCloseComplete: () => {
                    router.push('/')
                }
            })
        }
    }

    const declineInvite = async () => {
        await db.collection('invitations').doc(invitation.id).update({
            status: 'DECLINED'
        })
        toast({
            title: `Declined Team Invitation`,
            status: 'info',
            onCloseComplete: () => {
                router.push('/')
            }
        })


    }
    const getContent = (): JSX.Element => {
        if (error) {
            if (error.status === InvitationState.EXPIRED) {
                return <>
                    <EmptyState icon={<FaRegCalendarTimes />} text={error.message} />
                    <div className='p-4 text-center'>
                        <Button onClick={() => router.push('/')} width='sm'>Return To Home</Button>
                    </div>

                </>
            }
            if (error.status === InvitationState.INVALID) {
                return <>
                    <EmptyState icon={<FaExclamationTriangle />} text={error.message} />
                    <div className='p-4 text-center'>
                        <Button onClick={() => router.push('/')} width='sm'>Return To Home</Button>
                    </div>
                </>
            }
        } else if (invitation) {
            return (
                <div className='text-center pt-4'>
                    <div className='text-alt font-medium text-base'>to:</div>
                    {
                        invitation.team_logo && (
                            <Image className='mx-auto my-4' src={invitation.team_logo} alt='logo' width={150} />
                        )
                    }
                    <div className='text-main font-semibold text-3xl pb-4'>{invitation.team_name}</div>
                    <hr />
                    <div className='flex flex-row space-x-6 p-4'>
                        <Button onClick={acceptInvite} isFullWidth colorScheme='green' variant='solid'>Accept</Button>
                        <Button onClick={declineInvite} isFullWidth colorScheme='red'> Decline</Button>
                    </div>
                </div>
            )
        }
    }
    return (
        <div className='page-content'>
            <div className='text-content'>
                <div className='mx-auto bordered border p-4 pb-0 rounded-xl max-w-xl mt-12'>
                    <div className='page-title-sm text-center'>Your Invitation</div>
                    {getContent()}
                </div>
            </div>
        </div>
    )
}

export default Invitation