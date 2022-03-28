import React, { createContext, useContext } from 'react'
import { Collapse, Flex, Stack, Tab, TabList, Tabs, useDisclosure } from '@chakra-ui/react'
import useTabsNavigator from '@components/Layout/useTabsNavigator'
import Loader from '@components/Loader'
import { FaCaretDown, FaCaretLeft } from 'react-icons/fa'
// import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { defaultSeason, getCurrentSeason, Season, SeasonTwoSplit1 } from '@lib/season'

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

// interface Props {
//     children: React.ReactNode
//     baseUrl: string
// }

const mobileScreen = {
    base: 'flex',
    sm: 'none',
}

const desktopScreen = {
    base: 'none',
    sm: 'flex',
}

// const MobileDropdownTab = styled.div`
//     padding-left: 147px;
// `

interface TabsProps {
    season: string
    tabIndex: number
    handleTabChange: (index: number) => void
}

const MobileTabs = ({ tabIndex, handleTabChange, season }: TabsProps) => {
    const { isOpen, onToggle } = useDisclosure()
    return (
        <Flex display={mobileScreen}>
            <div className="w-full">
                <div
                    onClick={onToggle}
                    className="w-full flex flex-row justify-between items-center pb-0 py-1 cursor-pointer items-stretch"
                >
                    <div className="flex flex-row page-title-sm w-full">
                        <span className="text-main flex-shrink-0">Season {season}&nbsp;</span>
                        <span className={`text-primary w-full ${isOpen ? '' : 'border-b'}`}>
                            {seasonTabs[tabIndex].label}
                        </span>
                    </div>
                    <div className={`flex align-center ${isOpen ? '' : 'border-b'}`}>
                        {isOpen ? <FaCaretDown className="text-xl" /> : <FaCaretLeft className="text-xl" />}
                    </div>
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

const DesktopTabs = ({ tabIndex, handleTabChange, season }: TabsProps) => {
    return (
        <Flex display={desktopScreen} justifyContent={'center'} flexDirection={'column'}>
            <div className="page-title-sm text-center">Season {season}</div>
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

function getSeasonFromPath(path: string): string {
    const seasonSplit = path.split('/')
    return seasonSplit[seasonSplit.findIndex((elem) => elem === 'seasons') + 1]
}

type SeasonContext = {
    season: Season
}

export const SeasonContext = createContext<SeasonContext>({
    season: defaultSeason,
})

export function useSeason(): Season {
    const seasonContext = useContext(SeasonContext)
    if (seasonContext != null && seasonContext.season != null) {
        return seasonContext.season
    }
    return defaultSeason
}

const SeasonLayout = (props: React.PropsWithChildren<React.ReactNode>) => {
    const {
        query: { season: seasonQuery },
        pathname,
    } = useRouter()
    const currentSeason = seasonQuery ?? getSeasonFromPath(pathname)
    const season = getCurrentSeason({ season: currentSeason as string })
    const { handleTabChange, tabIndex, tabLoading } = useTabsNavigator({
        tabs: seasonTabs,
        baseUrl: `/seasons/${currentSeason}`,
    })
    const uppercaseSeason = (currentSeason as string).replace(/^\w/, (c) => c.toUpperCase())
    return (
        <SeasonContext.Provider value={{ season }}>
            <div className="page-content">
                <DesktopTabs tabIndex={tabIndex} handleTabChange={handleTabChange} season={uppercaseSeason} />
                <MobileTabs tabIndex={tabIndex} handleTabChange={handleTabChange} season={uppercaseSeason} />
                {tabLoading && <Loader text="Loading Season Information" />}
                {!tabLoading && <div className="p-2 py-4">{props.children}</div>}
            </div>
        </SeasonContext.Provider>
    )
}

export default SeasonLayout
