import React from 'react'
import RegisterForm from '@components/auth/RegisterForm'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'

export const getServerSideProps = withAuthSSR({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
})({})

const Register = () => {
    return (
        <div className="py-2">
            <RegisterForm />
        </div>
    )
}

Register.SEO = {
    title: 'Register',
    url: '/register',
}

export default Register
