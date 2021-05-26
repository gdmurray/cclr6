import firebaseAdmin from './firebase/admin'
import nookies from 'nookies'
import { Features, features, featureUrls } from '@lib/platform/features'
import Router from 'next/router'

export enum AuthAction {
    RENDER,
    RETURN_NULL,
    REDIRECT_TO_LOGIN,
    REDIRECT_TO_APP
}

export enum Referral {
    RESOLVED = 'resolved'
}

const AppPageURL = '/'
const AuthPageURL = '/login'

export const withAuthSSR = (
    {
        whenAuthed = AuthAction.RENDER,
        whenUnauthed = AuthAction.RENDER,
        appPageURL = AppPageURL,
        authPageURL = AuthPageURL,
        referral = null
    } = {}
) => (getServerSidePropsFunc) => async (ctx) => {
    const { resolvedUrl } = ctx
    if (!Features.isRouteValid(resolvedUrl)) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    if (referral === Referral.RESOLVED) {
        referral = resolvedUrl
    }

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
    const constructUrl = (destination: string): string => {
        if (referral) {
            return `${destination}?next=${encodeURIComponent(referral)}`
        }
        return destination
    }
    // is unauthed
    if (!AuthUser && whenUnauthed === AuthAction.REDIRECT_TO_LOGIN) {
        return {
            redirect: {
                destination: constructUrl(authPageURL),
                permanent: false
            }
        }
    }

    if (!AuthUser && whenUnauthed === AuthAction.REDIRECT_TO_APP) {
        return {
            redirect: {
                destination: constructUrl(appPageURL),
                permanent: false
            }
        }
    }

    if (AuthUser && whenAuthed === AuthAction.REDIRECT_TO_APP) {
        return {
            redirect: {
                destination: constructUrl(appPageURL),
                permanent: false
            }
        }
    }

    if (AuthUser && whenAuthed === AuthAction.REDIRECT_TO_LOGIN) {
        return {
            redirect: {
                destination: constructUrl(authPageURL),
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