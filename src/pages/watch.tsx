import React from 'react'
import ReactPlayer from 'react-player'
import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

const Watch = () => {
    return (
        <div className="page-content">
            <h1 className="page-title">Watch CCL</h1>
            <div>
                <Tabs className="watch-tabs focus:outline-none" variant="soft-rounded" colorScheme="red">
                    <div className="flex py-4 items-start md:items-center flex-col md:flex-row justify-between">
                        <TabList className="space-x-1">
                            <Tab>Live</Tab>
                            <Tab>Videos</Tab>
                        </TabList>
                    </div>
                    <TabPanels>
                        <TabPanel>
                            <Flex className="player-wrapper" h={{ base: 360, sm: 504, md: 648 }}>
                                <Flex w={{ base: 640, sm: 896, md: 1152 }} className="mx-auto">
                                    <ReactPlayer
                                        controls
                                        width="100%"
                                        height="100%"
                                        url={'https://www.twitch.tv/NorthernArena'}
                                        style={{
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                        }}
                                    />
                                </Flex>
                            </Flex>
                        </TabPanel>
                        <TabPanel>
                            <div className="text-alt-2 font-medium">Coming Soon</div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <style jsx>
                    {`
                        .player-wrapper {
                            padding-top: 56.25%;
                        }
                    `}
                </style>
            </div>
        </div>
    )
}

Watch.SEO = {
    title: 'Watch',
    url: '/watch',
    description: 'Watch CCLR6 Live or catch the replays of all of our Rainbow Six Esports games',
}
export default Watch
