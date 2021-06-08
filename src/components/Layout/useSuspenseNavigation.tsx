import React, { createContext, useEffect, useState } from 'react'
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

export function useSuspenseNavigation() {
    const { push, pathname, events } = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [key, setKey] = useState<string | null>(null)

    useEffect(() => {
        const handleStart = (_: string) => {
            setLoading(true)
        }

        const handleFinish = (_: string) => {
            setLoading(false)
            setKey(null)
        }

        events.on('routeChangeStart', handleStart)
        events.on('routeChangeComplete', handleFinish)
        return (): void => {
            events.off('routeChangeStart', handleStart)
            events.off('routeChangeComplete', handleFinish)
        }
    }, [pathname])

    function navigate(key, route) {
        setKey(key)
        push(route)
    }

    function isLoading(label) {
        return loading && label === key
    }

    return {
        isLoading,
        navigate,
        push,
    }
}
