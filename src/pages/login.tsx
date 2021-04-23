import React, { useEffect } from 'react'
import BasicMeta from '../components/meta/BasicMeta'
import OpenGraphMeta from '../components/meta/OpenGraphMeta'
import TwitterCardMeta from '../components/meta/TwitterCardMeta'
import RegisterForm from '../components/auth/registerForm'
import LoginForm from '../components/auth/loginForm'
import { AuthAction, propsWithUser, withAuthSSR } from '../lib/withSSRAuth'
import { useRouter } from 'next/router'
import firebase from '../lib/firebase'


export const getServerSideProps = withAuthSSR({
    whenAuthed: AuthAction.REDIRECT_TO_APP
})({})

const Login = (): JSX.Element => {
    return (
        <>
            <BasicMeta url={'/login'} />
            <OpenGraphMeta url={'/login'} />
            <TwitterCardMeta url={'/login'} />
            <div className='px-8'>
                <div
                    className='px-12 py-8 sm:px-20 md:px-24 flex flex-col justify-center w-full mx-auto max-w-xl border rounded-md bordered'>
                    <div
                        className='w-full text-center mb-4 font-bold text-2xl dark:text-gray-50 text-gray-900 mb-6'>
                        Sign In To Your CCL Account
                    </div>
                    <LoginForm />
                </div>
            </div>
        </>
    )
}

export default Login