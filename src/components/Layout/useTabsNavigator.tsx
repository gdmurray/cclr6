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

export default function useTabsNavigator({ tabs }: { tabs: Tab[] }): TabsNavigator {
    const [tabIndex, setTabIndex] = useState<number>(0)
    const { pathname, events, query } = useRouter()
    const { navigate, isLoading } = useSuspenseNavigation()

    const getPathName = (): { pathname: string; isQuery: boolean } => {
        if (Object.keys(query).length > 0) {
            const [queryKey] = Object.keys(query)
            const filteredPathname = pathname.replace(`/[${queryKey}]`, '')
            return {
                pathname: filteredPathname,
                isQuery: true,
            }
        }
        return {
            pathname,
            isQuery: false,
        }
    }

    useEffect(() => {
        const activeTab = tabs[tabIndex]
        if (activeTab.path !== getPathName().pathname) {
            const tab = tabs.map((e) => e.path).indexOf(getPathName().pathname)
            if (tab !== -1) {
                setTabIndex(tab)
            }
        }

        const handleRouteChange = (path) => {
            if (path !== activeTab.path) {
                const tab = tabs.map((e) => e.path).indexOf(path)
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
        if (getPathName().pathname !== tab.path) {
            navigate(tab.label, tab.path)
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
