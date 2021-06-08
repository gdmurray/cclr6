import React from 'react'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import RegisterTeamForm from '@components/teams/registerTeamForm'
import EmptyState from '@components/EmptyState'
import { FaEnvelope } from 'react-icons/fa'

const url = '/team/register'

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_APP,
    appPageURL: '/register',
    referral: url,
})(async () => {
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
