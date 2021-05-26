import { useRouter } from 'next/router'
import { analytics } from '@lib/firebase'
import React, { useEffect } from 'react'


export default function useAnalytics() {
    const router = useRouter()
    useEffect(() => {
        const logEvent = (url) => {
            analytics().setCurrentScreen(url)
            analytics().logEvent('screen_view')
        }

        router.events.on('routeChangeComplete', logEvent)
        logEvent(window.location.pathname)

        return () => {
            router.events.off('routeChangeComplete', logEvent)
        }
    }, [])
}