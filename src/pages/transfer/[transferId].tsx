import React from 'react'
import { AuthAction, Referral, withAuthSSR } from '@lib/withSSRAuth'
import getInvitationProps from '@components/getInvitationProps'
import { useRouter } from 'next/router'
import EmptyState from '@components/EmptyState'
import { FaExclamationTriangle, FaRegCalendarTimes } from 'react-icons/fa'
import { Button, Image, useToast } from '@chakra-ui/react'
import { Transfer } from '@lib/models/transfer'
import { InvitationState } from '@lib/models/invitations'

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_APP,
    appPageURL: '/login',
    referral: Referral.RESOLVED,
})(async (context) => {
    const {
        query: { transferId },
        user,
    } = context
    return await getInvitationProps<Transfer>(transferId, user, 'transfers')
})

const PageContent = (props: React.PropsWithChildren<React.ReactNode>) => {
    return (
        <div className="page-content mb-24">
            <div className="text-content">
                <div className="mx-auto bordered border p-4 pb-0 rounded-xl max-w-lg mt-12">{props.children}</div>
            </div>
        </div>
    )
}
const TransferPage = ({ error, invitation }): JSX.Element => {
    const router = useRouter()
    const toast = useToast({ variant: 'solid', position: 'top-right' })
    const onAccept = () => {
        fetch('/api/transfer/accept', {
            method: 'POST',
            body: JSON.stringify({ transfer_id: invitation.id }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {
                response.json().then((res) => {
                    const { message } = res
                    toast({
                        status: 'success',
                        title: message,
                        duration: 1000,
                        onCloseComplete: () => {
                            router.push('/team')
                        },
                    })
                })
            }
        })
    }
    if (error) {
        if (error.status === InvitationState.EXPIRED) {
            return (
                <PageContent>
                    <EmptyState icon={<FaRegCalendarTimes />} text={error.message} />
                    <div className="p-4 text-center">
                        <Button onClick={() => router.push('/')} width="sm">
                            Return to Home
                        </Button>
                    </div>
                </PageContent>
            )
        }
        if (error.status === InvitationState.INVALID) {
            return (
                <PageContent>
                    <EmptyState icon={<FaExclamationTriangle />} text={error.message} />
                    <div className="p-4 text-center">
                        <Button onClick={() => router.push('/')} width="sm">
                            Return To Home
                        </Button>
                    </div>
                </PageContent>
            )
        }
    } else {
        return (
            <PageContent>
                <div className="py-16 px-8">
                    {invitation.team_logo && (
                        <Image className="mx-auto my-4" src={invitation.team_logo} alt={'logo'} width={250} />
                    )}
                    <div className="text-main text-4xl font-semibold pb-4 leading-10">
                        You&#39;ve been invited to become the owner of{' '}
                        <span className="text-primary">{invitation.team_name}</span>
                    </div>
                    <div className="text-alt-2 text-lg font-medium leading-7">
                        This would give you access to manage players, registrations, and payment for&nbsp;
                        {invitation.team_name}. Becoming the owner of this team will make your current team inactive.
                    </div>
                    <div className="pt-8 text-center">
                        <Button colorScheme="green" isFullWidth={true} onClick={onAccept}>
                            Accept Ownership
                        </Button>
                    </div>
                </div>
            </PageContent>
        )
    }
}

export default TransferPage
