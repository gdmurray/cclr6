import React from 'react'
import DashboardButton from '@components/DashboardButton'
import { Flex, Image, useColorMode } from '@chakra-ui/react'
import Home from './home'
import ReactPlayer from 'react-player'
import { features } from '@lib/platform/features'

const Index = (): JSX.Element => {
    const { colorMode } = useColorMode()
    return (
        <div className='max-w-6xl mx-auto'>
            <div
                className='flex flex-col items-center text-center my-8'>
                <Image
                    className='mx-auto mb-2'
                    src={'/images/ccl-logo-leaf-red.svg'} alt='CCL-Logo'
                    width={{ base: '100px', md: '140px' }} />
                <h1 className='dark:text-gray-50 tracking-tight font-heavy text-6xl mb-8 font-medium text-gray-900'>
                    CCL: A NEW CHAPTER
                </h1>
                <p className='mb-8 text-xl font-normal tracking-tight leading-snug max-w-lg lg:max-w-xl'>Canada
                    Contenders
                    League is the newest chapter in Canadian Rainbow Six Esports</p>
                <div>
                    <DashboardButton
                        label={'Register Team'}
                        href='/team/register'
                        className={'dark:bg-white dark:hover:bg-gray-50 dark:active:bg-gray-100 dark:text-gray-900 bg-gray-900 text-gray-50 font-heavy'}>
                        Register&nbsp;{!features.registration && (
                        <span className='font-medium tracking-tight text-base text-primary'>(Coming Soon)</span>)}
                    </DashboardButton>
                </div>
            </div>
            <div className='about mt-24'>
                <div id='about'>
                    <div className='mb-6'>
                        <div className='hero-title'>
                            About
                        </div>
                    </div>
                    <div className='cards'>
                        <div>
                            <div className='title'>
                                Who We Are
                            </div>
                            <div className='content text-alt-2'>
                                The Canada Contenders League, also known as CCL, is a Canadian-based Rainbow Six: Siege
                                league
                                focused on diversifying and developing the competitive scene in Canada. We are all fans
                                and
                                players of Rainbow Six: Siege Esports, and want to see re-emergence of the talent-packed
                                Canadian competitive scene.
                            </div>
                        </div>
                        <div>
                            <div className='title'>
                                Our Mission
                            </div>
                            <div className='content text-alt-2'>The CCL staff strives to supply participants with a safe
                                and
                                competitive environment to showcase and develop their skills. We want to pick up where
                                the
                                Canadian scene left off, and continue evolving our competitive landscape to show that we
                                have what it takes.
                            </div>
                        </div>
                    </div>
                </div>
                <div id='how-it-works' className='mt-24'>
                    <div className='mb-6'>
                        <div className='hero-title'>
                            How it works
                        </div>
                    </div>
                    <div className='mb-24'>
                        <Flex className='player-wrapper'
                              h={{ base: 'auto', sm: 504, md: 648 }}
                        >
                            <Flex w={{ base: 'auto', sm: 896, md: 1152 }} className='mx-auto'>
                                <ReactPlayer
                                    controls
                                    width='100%'
                                    height='100%'
                                    url={'https://vimeo.com/543673280'} style={{
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }} />
                            </Flex>
                        </Flex>
                        <div className='page-title-sm text-center py-6'>Get Ready Canada!</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

Index.SEO = {
    url: '/',
    title: 'Home'
}

export default Index