import BasicMeta from '../components/meta/BasicMeta'
import OpenGraphMeta from '../components/meta/OpenGraphMeta'
import TwitterCardMeta from '../components/meta/TwitterCardMeta'
import React from 'react'
import ReactPlayer from 'react-player'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'


const Watch = () => {
    return (
        <>
            <BasicMeta url={'/watch'} />
            <OpenGraphMeta url={'/watch'} />
            <TwitterCardMeta url={'/watch'} />
            <div>
                <div className='page-title'>Watch CCL</div>
                <div>
                    <Tabs className='watch-tabs focus:outline-none' variant='soft-rounded' colorScheme='red'>
                        <div
                            className='flex py-4 items-start md:items-center flex-col md:flex-row justify-between'>
                            <TabList className="space-x-1">
                                <Tab>Live</Tab>
                                <Tab>Videos</Tab>
                            </TabList>
                        </div>
                        <TabPanels>
                            <TabPanel>
                                <div className='player'>
                                    <ReactPlayer
                                        controls
                                        url={'https://www.twitch.tv/cclr6s'} style={{
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }} />
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className='text-alt-2 font-medium'>Coming Soon</div>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </div>
        </>
    )
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