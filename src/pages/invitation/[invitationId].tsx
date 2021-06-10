import React from 'react'
import { AuthAction, Referral, withAuthSSR } from '@lib/withSSRAuth'
import { Invitation as IInvitation } from '@lib/models/invitations'
import getInvitationProps from '@components/getInvitationProps'

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

// todo: idk what to do if the user already has a team

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_APP,
    appPageURL: '/register',
    referral: Referral.RESOLVED,
})(async (context) => {
    const {
        query: { invitationId },
        user,
    } = context
    return await getInvitationProps<IInvitation>(invitationId, user, 'invitations')
})

const Invitation = (): JSX.Element => {
    // const acceptInvite = async () => {
    //     const result = await fetch('/api/invitation/accept', {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             user_id: user.uid,
    //             user_email: user.email,
    //             ...invitation,
    //         }),
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     })
    //     if (result.ok) {
    //         toast({
    //             title: `Successfully joined ${invitation.team_name}`,
    //             status: 'success',
    //             onCloseComplete: () => {
    //                 router.push('/')
    //             },
    //         })
    //     } else {
    //         toast({
    //             title: `Could not join team`,
    //             status: 'error',
    //             onCloseComplete: () => {
    //                 router.push('/')
    //             },
    //         })
    //     }
    // }
    //
    // const declineInvite = async () => {
    //     await db.collection('invitations').doc(invitation.id).update({
    //         status: 'DECLINED',
    //     })
    //     toast({
    //         title: `Declined Team Invitation`,
    //         status: 'info',
    //         onCloseComplete: () => {
    //             router.push('/')
    //         },
    //     })
    // }
    // const getContent = (): JSX.Element => {
    //     if (error) {
    //         if (error.status === InvitationState.EXPIRED) {
    //             return (
    //                 <>
    //                     <EmptyState icon={<FaRegCalendarTimes />} text={error.message} />
    //                     <div className="p-4 text-center">
    //                         <Button onClick={() => router.push('/')} width="sm">
    //                             Return To Home
    //                         </Button>
    //                     </div>
    //                 </>
    //             )
    //         }
    //         if (error.status === InvitationState.INVALID) {
    //             return (
    //                 <>
    //                     <EmptyState icon={<FaExclamationTriangle />} text={error.message} />
    //                     <div className="p-4 text-center">
    //                         <Button onClick={() => router.push('/')} width="sm">
    //                             Return To Home
    //                         </Button>
    //                     </div>
    //                 </>
    //             )
    //         }
    //     } else if (invitation) {
    //         return (
    //             <div className="text-center pt-4">
    //                 <div className="text-alt font-medium text-base">to:</div>
    //                 {invitation.team_logo && (
    //                     <Image className="mx-auto my-4" src={invitation.team_logo} alt="logo" width={150} />
    //                 )}
    //                 <div className="text-main font-semibold text-3xl pb-4">{invitation.team_name}</div>
    //                 <hr />
    //                 <div className="flex flex-row space-x-6 p-4">
    //                     <Button onClick={acceptInvite} isFullWidth colorScheme="green" variant="solid">
    //                         Accept
    //                     </Button>
    //                     <Button onClick={declineInvite} isFullWidth colorScheme="red">
    //                         {' '}
    //                         Decline
    //                     </Button>
    //                 </div>
    //             </div>
    //         )
    //     }
    // }
    return (
        <div className="page-content">
            <div className="text-content">
                <div className="mx-auto bordered border p-4 pb-0 rounded-xl max-w-xl mt-12">
                    <div className="page-title-sm text-center">Your Invitation</div>
                    Invitation Content
                </div>
            </div>
        </div>
    )
}

export default Invitation
