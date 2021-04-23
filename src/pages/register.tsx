import BasicMeta from '../components/meta/BasicMeta'
import OpenGraphMeta from '../components/meta/OpenGraphMeta'
import TwitterCardMeta from '../components/meta/TwitterCardMeta'
import React from 'react'
import RegisterForm from '../components/auth/registerForm'
import { AuthAction, withAuthSSR } from '../lib/withSSRAuth'

export const getServerSideProps = withAuthSSR({
    whenAuthed: AuthAction.REDIRECT_TO_APP
})({})

const Register = () => {
    return (
        <>
            <BasicMeta url={'/register'} />
            <OpenGraphMeta url={'/register'} />
            <TwitterCardMeta url={'/register'} />
            <RegisterForm />
        </>
    )
}


export default Register