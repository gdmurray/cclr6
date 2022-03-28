import React, { useEffect } from 'react'
import LoginForm from '@components/auth/loginForm'
import { AuthAction, Referral, withAuthSSR } from '@lib/withSSRAuth'
import firebase from '@lib/firebase/firebase'
import useRedirect from '@components/Layout/useRedirect'
import nookies from 'nookies'
import { useRouter } from 'next/router'

require('firebase/auth')
export const getServerSideProps = withAuthSSR({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    referral: Referral.RESOLVED,
})({})

const Login = (): JSX.Element => {
    const router = useRouter()
    const { redirect } = useRedirect()

    useEffect(() => {
        return firebase.auth().onIdTokenChanged((user) => {
            if (user && !user.isAnonymous) {
                user.getIdToken().then((token) => {
                    nookies.set(undefined, 'token', token, { path: '/' })
                    router.push(redirect)
                })
            }
        })
    }, [redirect])
    return (
        <div className="page-content">
            <div className="px-12 py-8 sm:px-20 md:px-24 flex flex-col justify-center w-full mx-auto max-w-xl border rounded-md bordered">
                <div className="w-full text-center mb-4 font-bold text-2xl dark:text-gray-50 text-gray-900 mb-6">
                    Sign In To Your CCL Account
                </div>
                <LoginForm redirect={redirect} />
            </div>
        </div>
    )
}

Login.SEO = {
    title: 'Login',
    url: '/login',
}

export default Login
