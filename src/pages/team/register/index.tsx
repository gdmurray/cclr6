import React from 'react'
import { AuthAction, withAuthSSR } from '../../../lib/withSSRAuth'


export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_APP,
    appPageURL: '/register',
    referral: '/team/register'
})({})

const Register = () => {
    return (
        <div className='page-content'>
            <div className='page-title-sm'>
                Team Registration Information
            </div>
        </div>
    )
}

Register.SEO = {
    title: 'Register Team',
    url: '/team/register'
}


export default Register
