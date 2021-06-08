import React from 'react'
import { Tab, TabList, Tabs } from '@chakra-ui/react'
import { useAuth } from '@lib/auth'
import useTeam from '@lib/useTeam'
import Loader from '@components/Loader'
import { TeamProvider } from '@components/teams/teamContext'
import useTabsNavigator from '@components/Layout/useTabsNavigator'
import { FaClipboardList, FaCog, FaCreditCard, FaHome, FaUser, FaUsers } from 'react-icons/fa'

const teamTabs: { label: React.ReactNode; path: string }[] = [
    {
        label: (
            <>
                <FaHome />
                &nbsp;Home
            </>
        ),
        path: '/team',
    },
    {
        label: (
            <>
                <FaUsers />
                &nbsp;Players
            </>
        ),
        path: '/team/players',
    },
    {
        label: (
            <>
                <FaClipboardList />
                &nbsp;Registration
            </>
        ),
        path: '/team/registration',
    },
    {
        label: (
            <>
                <FaCreditCard />
                &nbsp;Payments
            </>
        ),
        path: '/team/payments',
    },
    {
        label: (
            <>
                <FaCog />
                &nbsp;Settings
            </>
        ),
        path: '/team/settings',
    },
]

const TeamLayout = (props: React.PropsWithChildren<React.ReactNode>) => {
    const { user, loading: authLoading } = useAuth()
    const { team, loading: teamLoading, setTeam } = useTeam({ user })

    const { tabLoading, handleTabChange, tabIndex } = useTabsNavigator({ tabs: teamTabs })

    const loading = authLoading || teamLoading || tabLoading

    return (
        <div className="page-content">
            <div className="page-title-sm">Team Information</div>
            <div>
                <Tabs index={tabIndex} onChange={handleTabChange}>
                    <TabList>
                        {teamTabs.map((tab) => {
                            return <Tab key={tab.path}>{tab.label}</Tab>
                        })}
                    </TabList>
                </Tabs>
            </div>
            <div>
                {loading && <Loader text="Loading Team Information" />}
                {!loading && user && !team && <div>Error Loading Team Information, do you belong to a team?</div>}
                {!loading && user && team && (
                    <TeamProvider team={team} user={user} setTeam={setTeam}>
                        <div className="p-2 py-4">{props.children}</div>
                    </TeamProvider>
                )}
            </div>
        </div>
    )
}

export default TeamLayout
