import React from 'react'
import DashboardButton from '../components/DashboardButton'
import { Badge, useColorMode } from '@chakra-ui/react'
import { features } from '@lib/features'


const Home = () => {
    const { colorMode } = useColorMode()
    return (
        <>
            <div className='container mx-auto flex px-5 lg:px-16 py-24 md:flex-row flex-col items-center'>
                <div className='lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0'>
                    <img className='object-cover object-center rounded' alt='hero'
                         src='https://dummyimage.com/720x600' />
                </div>
                <div
                    className='lg:flex-grow md:w-1/2 lg:pl-24 md:pl-8 flex flex-col md:items-start md:text-left items-center text-center'>
                    <h1 className='dark:text-gray-50 tracking-tight font-heavy text-6xl mb-8 font-medium text-gray-900'>
                        A NEW CHAPTER
                    </h1>
                    <p className='mb-8 text-xl font-normal tracking-tight leading-snug max-w-lg lg:max-w-xl'>Canada
                        Contenders
                        League is the newest chapter in Canadian Rainbow Six Esports</p>
                    <div className='flex justify-center md:justify-start space-x-4 w-full'>
                        <DashboardButton
                            label={'Learn More'}
                            href={'/about'}
                            className={'bg-primary font-heavy hover:bg-red-600 active:bg-red-500'}>
                            Learn More
                        </DashboardButton>
                        {features.registration ? (<DashboardButton
                                label={'Register Team'}
                                href='/team/register'
                                className={'dark:bg-white dark:hover:bg-gray-50 dark:active:bg-gray-100 dark:text-gray-900 bg-gray-900 text-gray-50 font-heavy'}>
                                Register Team
                            </DashboardButton>)
                            :
                            (
                                <DashboardButton
                                    label={'Register Team'}
                                    href='/team/register'
                                    className={'dark:bg-white dark:hover:bg-gray-50 dark:active:bg-gray-100 dark:text-gray-900 bg-gray-900 text-gray-50 font-heavy'}>
                                    Register&nbsp;<Badge colorScheme={colorMode === 'light' ? 'red' : 'black'} style={{
                                    height: '20px !important',
                                    lineHeight: '1.5em !important'
                                }}>Coming
                                    Soon</Badge>
                                </DashboardButton>
                            )}

                    </div>
                </div>
            </div>
        </>
    )
}


Home.SEO = {
    url: '/'
}
export default Home