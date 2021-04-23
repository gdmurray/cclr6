//Ref https://docs.react2025.com/firebase/use-auth
import React, { useState, useEffect, useContext, createContext } from 'react'
import Router from 'next/router'
import firebase, { twitterProvider, UserInfo } from './firebase'
import nookies from 'nookies'
import { isPrivateMode } from './is-private-mode'

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
        })
    }, [])

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    console.log(user)
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
        login: async () => {
            const isPrivate = await isPrivateMode()
            console.log(isPrivate)
            firebase.auth().settings
            return Promise.resolve()
            // if (await isPrivateMode()) {
            //     console.log('We gotta do some bullshit')
            //     return Promise.resolve()
            // }
            // return firebase
            //     .auth()
            //     .signInWithRedirect(new firebase.auth.TwitterAuthProvider())
        }
    }

    const handleUser = async (rawUser) => {
        if (rawUser) {
            const user = await formatUser(rawUser)
            // const { token, ...userWithoutToken } = user
            // createUser(user.uid, userWithoutToken)
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
            })
    }

    const signOut = () => {
        console.log('Signing Out')
        return firebase
            .auth()
            .signOut()
            .then(() => {
                Router.push('/')
                handleUser(false)
            })
    }

    useEffect(() => {
        return firebase.auth().onIdTokenChanged(async (user) => {
            if (!user) {
                handleUser(null)
                nookies.set(undefined, 'token', '', { path: '/' })
            } else {
                const token = await user.getIdToken()
                console.log('onIDTokenChanged')
                handleUser(user)
                nookies.set(undefined, 'token', token, { path: '/' })
            }
        })
    }, [])


    // force refresh the token every 10 minutes
    useEffect(() => {
        const handle = setInterval(async () => {
            const user = firebase.auth().currentUser
            if (user) await user.getIdToken(true)
        }, 10 * 60 * 1000)

        // clean up setInterval
        return () => clearInterval(handle)
    }, [])

    const getFreshToken = async () => {
        console.log('getFreshToken called', new Date())
        const currentUser = firebase.auth().currentUser
        if (currentUser) {
            const token = await currentUser.getIdToken(false)
            return `${token}`
        } else {
            return ''
        }
    }

    return {
        user,
        loading,
        Twitter,
        signinWithEmail,
        signOut,
        getFreshToken
    }
}


// const getStripeRole = async () => {
//   await firebase.auth().currentUser.getIdToken(true);
//   const decodedToken = await firebase.auth().currentUser.getIdTokenResult();
//   return decodedToken.claims.stripeRole || 'free';
// };

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
        displayName: user.displayName,
        providerData: user.providerData,
        providers: formatProviders(user.providerData),
        photoUrl: user.photoURL,
        token,
        expirationTime
        // stripeRole: await getStripeRole(),
    }
}

