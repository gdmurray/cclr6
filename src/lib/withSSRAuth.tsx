import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
// import { User } from '@firebase/auth-types'
import firebaseAdmin from './firebase-admin'
import nookies from 'nookies'

// import firebase from 'firebase'


interface PropsWithUser {
    user: any
}

export async function propsWithUser(
    context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PropsWithUser>> {
    try {
        const cookies = nookies.get(context)
        const token = await firebaseAdmin.auth().verifyIdToken(cookies.token)
        return {
            props: {
                user: token
            }
        }
    } catch (e) {
        return {
            props: {
                user: null
            }
        }
    }
}

export enum AuthAction {
    RENDER,
    RETURN_NULL,
    REDIRECT_TO_LOGIN,
    REDIRECT_TO_APP
}

const AppPageURL = '/'
const AuthPageURL = '/login'

export const withAuthSSR = (
    {
        whenAuthed = AuthAction.RENDER,
        whenUnauthed = AuthAction.RENDER,
        appPageURL = AppPageURL,
        authPageURL = AuthPageURL
    } = {}
) => (getServerSidePropsFunc) => async (ctx) => {
    let AuthUser = null
    try {
        const cookies = nookies.get(ctx)
        const token = await firebaseAdmin.auth().verifyIdToken(cookies.token)
        if (token) {
            AuthUser = token
        }
    } catch (e) {
        // const { code } = e

    }

    // is unauthed
    if (!AuthUser && whenUnauthed === AuthAction.REDIRECT_TO_LOGIN) {
        return {
            redirect: {
                destination: authPageURL,
                permanent: false
            }
        }
    }

    if (!AuthUser && whenUnauthed === AuthAction.REDIRECT_TO_APP) {
        return {
            redirect: {
                destination: appPageURL,
                permanent: false
            }
        }
    }

    if (AuthUser && whenAuthed === AuthAction.REDIRECT_TO_APP) {
        return {
            redirect: {
                destination: appPageURL,
                permanent: false
            }
        }
    }

    if (AuthUser && whenAuthed === AuthAction.REDIRECT_TO_LOGIN) {
        return {
            redirect: {
                destination: authPageURL,
                permanent: false
            }
        }
    }
    let returnData = { props: { user: AuthUser } }

    if (getServerSidePropsFunc && typeof getServerSidePropsFunc === 'function') {
        ctx.user = AuthUser
        const composedProps = (await getServerSidePropsFunc(ctx)) || {}
        if (composedProps) {
            if (composedProps.props) {
                returnData = { ...composedProps }
                returnData.props.user = AuthUser
            } else if (composedProps.notFound || composedProps.redirect) {
                returnData = { ...composedProps }
            }
        }
    }
    return returnData
}