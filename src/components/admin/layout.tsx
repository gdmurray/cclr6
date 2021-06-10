import React from 'react'
import { Button, Tab, TabList, Tabs } from '@chakra-ui/react'
import useTabsNavigator from '@components/Layout/useTabsNavigator'
import Loader from '@components/Loader'
import { FaArrowLeft } from 'react-icons/fa'

const tabs = [
    {
        label: 'Home',
        path: '/admin',
    },
    {
        label: 'Teams',
        path: '/admin/teams',
    },
    {
        label: 'Season',
        path: '/admin/season',
    },
    {
        label: 'Email Test',
        path: '/admin/test',
    },
]

const AdminLayout = (props: React.PropsWithChildren<React.ReactNode>) => {
    const { tabIndex, handleTabChange, tabLoading, isQuery, navigate } = useTabsNavigator({ tabs })
    return (
        <div className="page-content">
            <div className="page-title-sm">Admin Portal</div>
            <div>
                <Tabs index={tabIndex} onChange={handleTabChange}>
                    <TabList>
                        {tabs.map((tab) => {
                            return <Tab key={tab.path}>{tab.label}</Tab>
                        })}
                    </TabList>
                </Tabs>
            </div>
            <div>
                <div className="py-4">
                    {tabLoading && <Loader text="Loading Admin Content" />}
                    {!tabLoading && !isQuery && <>{props.children}</>}
                    {!tabLoading && isQuery && (
                        <div>
                            <Button onClick={() => navigate(tabs[tabIndex].label, tabs[tabIndex].path)}>
                                <FaArrowLeft />
                                &nbsp;Back
                            </Button>
                            <div className="p-2">{props.children}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminLayout
