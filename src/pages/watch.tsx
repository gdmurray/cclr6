import BasicMeta from '../components/meta/BasicMeta'
import OpenGraphMeta from '../components/meta/OpenGraphMeta'
import TwitterCardMeta from '../components/meta/TwitterCardMeta'
import React from 'react'
import ReactPlayer from 'react-player'
import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'


const Watch = () => {
    return (
        <div className='page-content'>
            <div className='page-title'>Watch CCL</div>
            <div>
                <Tabs className='watch-tabs focus:outline-none' variant='soft-rounded' colorScheme='red'>
                    <div
                        className='flex py-4 items-start md:items-center flex-col md:flex-row justify-between'>
                        <TabList className='space-x-1'>
                            <Tab>Live</Tab>
                            <Tab>Videos</Tab>
                        </TabList>
                    </div>
                    <TabPanels>
                        <TabPanel>
                            <Flex className='player-wrapper'
                                  h={{ base: 360, sm: 504, md: 648 }}
                            >
                                <Flex w={{ base: 640, sm: 896, md: 1152 }} className='mx-auto'>
                                    <ReactPlayer
                                        controls
                                        width='100%'
                                        height='100%'
                                        url={'https://www.twitch.tv/cclr6s'} style={{
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }} />
                                </Flex>
                            </Flex>
                        </TabPanel>
                        <TabPanel>
                            <div className='text-alt-2 font-medium'>Coming Soon</div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <style jsx>{`
                  .player-wrapper {
                    padding-top: 56.25%
                  }
                `}

                </style>
            </div>
        </div>
    )
}

Watch.SEO = {
    title: 'Watch CCLR6',
    url: '/watch'
}
export default Watch

// <div className='pl-2 py-4 w-full' style={{
//     width: '15rem'
// }}>
// <InputGroup variant='filled'>
//     <InputLeftElement><AiOutlineSearch /></InputLeftElement>
// <Input placeholder="Search" />
// </InputGroup>
// </div>


// <Flex height={{ base: 360, sm: 504, md: 648 }} p={2}>