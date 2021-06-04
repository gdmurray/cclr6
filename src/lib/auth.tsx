//Ref https://docs.react2025.com/firebase/use-auth
import React, { useState, useEffect, useContext, createContext, useCallback } from 'react'
import Router from 'next/router'
import firebase, { analytics, twitterProvider, UserInfo } from './firebase/firebase'
import nookies from 'nookies'

require('firebase/auth')

interface Twitter {
    login(redirect): void;

    link(): void;

    unlink(): void;
}

interface AuthContext {
    user: User | null;
    loading: boolean;
    Twitter: Twitter;

    signinWithEmail(email, password, redirect?): Promise<void>;

    signOut(): void;
}


const authContext = createContext<AuthContext>({
    loading: true,
    user: null,
    Twitter: null,
    signinWithEmail: undefined,
    signOut: null
})

export function AuthProvider({ children }: React.PropsWithChildren<React.ReactNode>) {
    const auth = useFirebaseAuth()
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext)
}

export interface User {
    displayName: string | null;
    email: string;
    emailVerified: boolean;
    expirationTime: string;
    photoUrl: string | null;
    providerData: UserInfo[];
    providers: Record<string, UserInfo>;
    token: string;
    uid: string;
}

function useFirebaseAuth() {
    useEffect(() => {
        firebase.auth().getRedirectResult().then((result) => {
            if (result.credential) {
                // todo: handle additional user info, maybe save username, idk
                const { user } = result
                handleUser(user)
            }
        }).catch((err) => {
            console.log('Could not get redirect result: ', err)
        })
    }, [])

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const onUserChangedEvent = useCallback(() => {
        if (!loading && user && user.uid) {
            analytics().setUserId(user.uid)
        }
    }, [user?.uid, loading])

    useEffect(onUserChangedEvent, [user?.uid, loading])

    const Twitter = {
        link: () => {
            return firebase.auth().currentUser.linkWithPopup(twitterProvider).then(
                (result) => {
                    firebase.auth().updateCurrentUser(result.user)
                    handleUser(result.user)
                    Router.reload()
                }
            ).catch(err => {
                console.log(err)
            })
        },
        unlink: () => {
            return firebase.auth().currentUser.unlink('twitter.com').then(
                (result) => {
                    firebase.auth().updateCurrentUser(result)
                    handleUser(result)
                    Router.reload()
                }
            )
        },
        login: () => {
            return firebase
                .auth()
                .signInWithRedirect(new firebase.auth.TwitterAuthProvider())
        }
    }

    const handleUser = async (rawUser) => {
        if (rawUser) {
            const user = await formatUser(rawUser)
            setUser(user)
            setLoading(false)
            return user
        } else {
            setUser(null)
            setLoading(false)
            return false
        }
    }


    const signinWithEmail = (email, password, redirect): Promise<void> => {
        setLoading(true)
        return firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                console.log('signin with email')
                handleUser(response.user)
                if (redirect) {
                    Router.push(redirect)
                }
            }).catch((err) => {
                setLoading(false)
                throw err
            })
    }

    const signOut = () => {
        return firebase
            .auth()
            .signOut()
            .then(() => {
                Router.push('/')
                handleUser(false)
            })
    }

    useEffect(() => {
        return firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                const token = await user.getIdToken()
                nookies.set(undefined, 'token', token, { path: '/' })
                await handleUser(user)
            } else {
                handleUser(null)
                nookies.set(undefined, 'token', '', { path: '/' })
            }
        })
    }, [])


    // force refresh the token every 10 minutes
    const FORCE_REFRESH_MINUTES = 5
    useEffect(() => {
        const handle = setInterval(async () => {
            const user = firebase.auth().currentUser
            if (user) await user.getIdToken(true)
        }, FORCE_REFRESH_MINUTES * 60 * 1000)

        // clean up setInterval
        return () => clearInterval(handle)
    }, [])


    return {
        user,
        loading,
        Twitter,
        signinWithEmail,
        signOut
    }
}

const formatProviders = (providerData) => {
    return providerData.reduce((acc, curr) => {
        acc[curr.providerId] = curr
        return acc
    }, {})
}

const formatUser = async (user) => {
    const decodedToken = await user.getIdTokenResult(/*forceRefresh*/ true)
    const { token, expirationTime } = decodedToken
    return {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        providerData: user.providerData,
        providers: formatProviders(user.providerData),
        photoUrl: user.photoURL,
        token,
        expirationTime
    }
}

