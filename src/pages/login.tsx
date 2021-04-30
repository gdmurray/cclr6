import React, { useEffect } from 'react'
import LoginForm from '@components/auth/loginForm'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'


export const getServerSideProps = withAuthSSR({
    whenAuthed: AuthAction.REDIRECT_TO_APP
})({})

const Login = (): JSX.Element => {
    return (
        <div className='page-content'>
            <div
                className='px-12 py-8 sm:px-20 md:px-24 flex flex-col justify-center w-full mx-auto max-w-xl border rounded-md bordered'>
                <div
                    className='w-full text-center mb-4 font-bold text-2xl dark:text-gray-50 text-gray-900 mb-6'>
                    Sign In To Your CCL Account
                </div>
                <LoginForm />
            </div>
        </div>
    )
}

Login.SEO = {
    title: 'Login',
    url: '/login'
}

export default Login