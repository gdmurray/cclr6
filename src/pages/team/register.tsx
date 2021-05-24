import React from 'react'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import RegisterTeamForm from '@components/teams/registerTeamForm'

const url = "/team/register"

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_APP,
    appPageURL: '/register',
    referral: url
})({})

const Register = () => {
    return (
        <div className='page-content'>
            <div className='page-title-sm'>
                Team Registration Information
            </div>
            <div className='p-6 py-12 max-w-2xl'>
                <RegisterTeamForm />
            </div>
        </div>
    )
}

Register.SEO = {
    title: 'Register Team',
    url
}


export default Register
