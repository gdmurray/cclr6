import React, { useEffect, useState } from 'react'
import { Tab, TabList, Tabs } from '@chakra-ui/react'
import { useAuth } from '@lib/auth'
import useTeam from '@lib/useTeam'
import Loader from '@components/Loader'
import { useRouter } from 'next/router'
import { TeamProvider } from '@components/teams/teamContext'
import { useSuspenseNavigation } from '@components/Layout/useSuspenseNavigation'

const teamTabs = [
    {
        label: 'Home',
        path: '/team'
    },
    {
        label: 'Players',
        path: '/team/players'
    },
    {
        label: 'Registration',
        path: '/team/registration'
    },
    {
        label: 'Payments',
        path: '/team/payments'
    }
]

const TeamLayout = (props: React.PropsWithChildren<React.ReactNode>) => {
    const [tabIndex, setTabIndex] = useState<number>(0)
    const { user, loading: authLoading } = useAuth()
    const { team, loading: teamLoading } = useTeam({ user })

    const { pathname, events, push } = useRouter()
    const { navigate, isLoading } = useSuspenseNavigation()

    useEffect(() => {
        const activeTab = teamTabs[tabIndex]
        if (activeTab.path !== pathname) {
            const tab = teamTabs.map(e => e.path).indexOf(pathname)
            if (tab !== -1) {
                setTabIndex(tab)
            }
        }

        const handleRouteChange = (path) => {
            if (path !== activeTab.path) {
                const tab = teamTabs.map(e => e.path).indexOf(path)
                if (tab !== -1) {
                    setTabIndex(tab)
                }
            }
        }
        events.on('routeChangeComplete', handleRouteChange)
        return () => events.off('routeChangeComplete', handleRouteChange)
    }, [])

    const loading = authLoading || teamLoading || isLoading(teamTabs[tabIndex].label)

    const handleTabChange = (index) => {
        setTabIndex(index)
        const tab = teamTabs[index]
        if (pathname !== tab.path) {
            navigate(tab.label, tab.path)
        }
    }

    return (
        <div className='page-content'>
            <div className='page-title-sm'>Team Information</div>
            <div>
                <Tabs index={tabIndex} onChange={handleTabChange}>
                    <TabList>
                        {teamTabs.map(tab => {
                            return (
                                <Tab key={tab.path}>{tab.label}</Tab>
                            )
                        })}
                    </TabList>
                </Tabs>
            </div>
            <div>
                {loading && (
                    <Loader text='Loading Team Information' />
                )}
                {!loading && (
                    <TeamProvider team={team} user={user}>
                        <div className='p-2 py-4'>{props.children}</div>
                    </TeamProvider>
                )}
            </div>
        </div>
    )
}

export default TeamLayout