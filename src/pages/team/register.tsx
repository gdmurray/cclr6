import React from 'react'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import RegisterTeamForm from '@components/teams/registerTeamForm'
import EmptyState from '@components/EmptyState'
import { FaEnvelope } from 'react-icons/fa'
import { adminFireStore } from '@lib/firebase/admin'

const url = '/team/register'

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_APP,
    appPageURL: '/register',
    referral: url,
})(async ({ user }) => {
    const userTeams = await adminFireStore.collection('teams').where('owner', '==', user.uid).get()
    if (userTeams.size > 0) {
        // const [userTeam] = userTeams.docs
        return {
            redirect: {
                destination: '/team',
                permanent: false,
            },
        }
    }
    return {
        props: {
            verified: true,
        },
    }
})

const Register = ({ verified }: { verified: boolean }) => {
    return (
        <div className="page-content">
            <div className="page-title-sm">Team Registration Information</div>
            {verified ? (
                <div className="p-6 py-12 max-w-2xl">
                    <RegisterTeamForm />
                </div>
            ) : (
                <div className="p-6 py-12 max-w-2xl mx-auto">
                    <EmptyState
                        icon={<FaEnvelope />}
                        text={'Please Verify your Email First!'}
                        subtext={
                            'Please check your email folder shortly, if you do not see an email appear within 5 minutes, be sure to check your spam folder.'
                        }
                    />
                </div>
            )}
        </div>
    )
}

Register.SEO = {
    title: 'Register Team',
    url,
}

export default Register
