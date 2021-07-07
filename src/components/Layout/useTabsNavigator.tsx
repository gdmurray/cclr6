import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSuspenseNavigation } from '@components/Layout/useSuspenseNavigation'

export interface Tab {
    label: string | React.ReactNode
    path: string
}

interface TabsNavigator {
    tabLoading: boolean
    handleTabChange: (index: number) => void
    tabIndex: number
    isQuery: boolean
    pathname: string

    navigate(key, route): void
}

export default function useTabsNavigator({ tabs, baseUrl }: { tabs: Tab[]; baseUrl?: string }): TabsNavigator {
    const [tabIndex, setTabIndex] = useState<number>(0)
    const { pathname, events, query } = useRouter()
    const { navigate, isLoading } = useSuspenseNavigation()

    function withBase(path: string): string {
        if (baseUrl && baseUrl !== path) {
            if (path.startsWith(baseUrl) || baseUrl === path) {
                return path
            }
            return baseUrl + path
        }
        return path
    }

    const getPathName = (): { pathname: string; isQuery: boolean } => {
        if (Object.keys(query).length > 0) {
            const [queryKey] = Object.keys(query)
            const filteredPathname = pathname.replace(`/[${queryKey}]`, '')
            return {
                pathname: withBase(filteredPathname),
                isQuery: true,
            }
        }
        return {
            pathname: withBase(pathname),
            isQuery: false,
        }
    }

    useEffect(() => {
        const activeTab = tabs[tabIndex]
        if (withBase(activeTab.path) !== getPathName().pathname) {
            console.log('initial')
            console.log(getPathName().pathname)
            const tab = tabs.map((e) => withBase(e.path)).indexOf(getPathName().pathname)
            console.log('Tab: ', tab)
            if (tab !== -1) {
                setTabIndex(tab)
            }
        }

        const handleRouteChange = (path) => {
            console.log('ROUTE CHANGE: ', path, activeTab.path)
            if (path !== activeTab.path) {
                const tab = tabs.map((e) => withBase(e.path)).indexOf(path)
                console.log('path: ', path)
                console.log('Tab: ', tab)
                if (tab !== -1) {
                    setTabIndex(tab)
                }
            }
        }
        events.on('routeChangeComplete', handleRouteChange)
        return () => events.off('routeChangeComplete', handleRouteChange)
    }, [])

    const handleTabChange = (index) => {
        setTabIndex(index)
        const tab = tabs[index]
        const path = withBase(tab.path)
        console.log('Handling tab change: ', tab.path, path)
        if (getPathName().pathname !== path) {
            navigate(tab.label, path)
        }
    }

    return {
        tabLoading: isLoading(tabs[tabIndex].label),
        handleTabChange,
        tabIndex,
        isQuery: getPathName().isQuery,
        pathname: getPathName().pathname,
        navigate,
    }
}
