import React from 'react'
import { Collapse, Flex, Stack, Tab, TabList, Tabs, useDisclosure } from '@chakra-ui/react'
import useTabsNavigator from '@components/Layout/useTabsNavigator'
import Loader from '@components/Loader'
import { FaCaretDown, FaCaretLeft } from 'react-icons/fa'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'

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

const mobileScreen = {
    base: 'flex',
    sm: 'none',
}

const desktopScreen = {
    base: 'none',
    sm: 'flex',
}

const MobileDropdownTab = styled.div`
    padding-left: 147px;
`

interface TabsProps {
    tabIndex: number
    handleTabChange: (index: number) => void
}

const MobileTabs = ({ tabIndex, handleTabChange }: TabsProps) => {
    const { isOpen, onToggle } = useDisclosure()
    return (
        <Flex display={mobileScreen}>
            <div className="w-full">
                <div
                    onClick={onToggle}
                    className="w-full flex flex-row justify-between items-center pb-0 py-1 px-2 cursor-pointer"
                >
                    <span className="page-title-sm text-center text-main">
                        Season One&nbsp;<span className="text-primary">{seasonTabs[tabIndex].label}</span>
                    </span>
                    <div>{isOpen ? <FaCaretDown className="text-xl" /> : <FaCaretLeft className="text-xl" />}</div>
                </div>
                <Collapse in={isOpen}>
                    <Stack mt={0} spacing={0}>
                        <Tabs index={tabIndex} onChange={handleTabChange} variant={'unstyled'} orientation="vertical">
                            <TabList>
                                {seasonTabs.map((tab, index) => {
                                    return (
                                        <Tab
                                            hidden={tabIndex === index}
                                            paddingTop={'0em'}
                                            paddingBottom={'0.15em'}
                                            justifyContent={'flex-start'}
                                            className={`${
                                                tabIndex === index && 'text-primary'
                                            } seasons-navigation tracking-wide`}
                                            fontSize={'1.75rem'}
                                            key={tab.path}
                                        >
                                            {tab.label}
                                        </Tab>
                                    )
                                })}
                            </TabList>
                        </Tabs>
                    </Stack>
                </Collapse>
            </div>
        </Flex>
    )
}

const DesktopTabs = ({ tabIndex, handleTabChange }: TabsProps) => {
    return (
        <Flex display={desktopScreen} justifyContent={'center'} flexDirection={'column'}>
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
        </Flex>
    )
}

const SeasonLayout = (props: React.PropsWithChildren<React.ReactNode>) => {
    const {
        query: { season },
    } = useRouter()
    const { handleTabChange, tabIndex, tabLoading } = useTabsNavigator({
        tabs: seasonTabs,
        baseUrl: `/seasons/${season}`,
    })
    return (
        <div className="page-content">
            <DesktopTabs tabIndex={tabIndex} handleTabChange={handleTabChange} />
            <MobileTabs tabIndex={tabIndex} handleTabChange={handleTabChange} />
            {tabLoading && <Loader text="Loading Season Information" />}
            {!tabLoading && <div className="p-2 py-4">{props.children}</div>}
        </div>
    )
}

export default SeasonLayout
