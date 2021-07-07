import React from 'react'
import { Badge, Tab, TabList, Tabs } from '@chakra-ui/react'
import useTabsNavigator from '@components/Layout/useTabsNavigator'
import Loader from '@components/Loader'

const seasonTabs: { label: React.ReactNode; path: string }[] = [
    {
        label: <>Home</>,
        path: '/',
    },
    {
        label: <>Teams</>,
        path: '/teams',
    },
    {
        label: <>Schedule</>,
        path: '/schedule',
    },
    {
        label: <>Vods</>,
        path: '/vods',
    },
    {
        label: (
            <>
                Stats
                {/*<Badge size="sm" ml="1" colorScheme="green">*/}
                {/*    Soon*/}
                {/*</Badge>*/}
            </>
        ),
        path: '/stats',
    },
]

interface Props {
    children: React.ReactNode
    baseUrl: string
}

const SeasonLayout = (props: Props) => {
    const { baseUrl } = props
    const { handleTabChange, tabIndex, tabLoading } = useTabsNavigator({ tabs: seasonTabs, baseUrl })
    return (
        <div className="page-content">
            <div className="page-title-sm text-center">Season One</div>
            <div>
                <Tabs index={tabIndex} onChange={handleTabChange} variant={'unstyled'}>
                    <TabList style={{ justifyContent: 'center' }}>
                        {seasonTabs.map((tab, index) => {
                            return (
                                <Tab
                                    className={`${tabIndex === index && 'text-primary'} navigation-item tracking-wide`}
                                    fontSize={'1.5rem'}
                                    key={tab.path}
                                >
                                    {tab.label}
                                </Tab>
                            )
                        })}
                    </TabList>
                </Tabs>
            </div>
            {tabLoading && <Loader text="Loading Season Information" />}
            {!tabLoading && <div className="p-2 py-4">{props.children}</div>}
        </div>
    )
}

export default SeasonLayout
