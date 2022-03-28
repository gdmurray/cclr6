import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

interface LoadingContext {
    isLoading(label): boolean

    navigate(label, route): void

    push(route): Promise<boolean>
}

const loadingContext = createContext<LoadingContext>({
    isLoading: null,
    navigate: null,
    push: null,
})

export function LoadingProvider({ children }: React.PropsWithChildren<React.ReactNode>) {
    const suspense = useSuspenseNavigation()
    return <loadingContext.Provider value={suspense}>{children}</loadingContext.Provider>
}

export function useLoading() {
    return useContext(loadingContext)
}

export function useSuspenseNavigation() {
    const { push, pathname, events } = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [key, setKey] = useState<string | null>(null)

    useEffect(() => {
        const handleStart = (_: string) => {
            if (!loading) {
                console.log('HandleStart: ', loading)
                setLoading(true)
            }
        }

        const handleFinish = (_: string) => {
            console.log('Loading Finished: ', key)
            if (loading) {
                setLoading(false)
            }
            if (key != null) {
                setKey(null)
            }
        }

        events.on('routeChangeStart', handleStart)
        events.on('routeChangeComplete', handleFinish)
        return (): void => {
            events.off('routeChangeStart', handleStart)
            events.off('routeChangeComplete', handleFinish)
        }
    }, [events, pathname])

    function navigate(key, route) {
        console.log('Setting Key: ', key)
        setKey(key)
        push(route)
    }

    function isLoading(label) {
        if (key == null) {
            return false
        }
        return loading && label === key
    }

    return {
        isLoading,
        navigate,
        push,
    }
}
