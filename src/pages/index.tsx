import BasicMeta from '../components/meta/BasicMeta'
import OpenGraphMeta from '../components/meta/OpenGraphMeta'
import TwitterCardMeta from '../components/meta/TwitterCardMeta'
import React from 'react'
import DashboardButton from '../components/DashboardButton'
import { background } from '@chakra-ui/react'
import Head from 'next/head'


const Index = () => {
    return (
        <>
            <div className='container mx-auto flex px-5 py-24 md:flex-row flex-col items-center'>
                <div className='lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0'>
                    <img className='object-cover object-center rounded' alt='hero'
                         src='https://dummyimage.com/720x600' />
                </div>
                <div
                    className='lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center'>
                    <h1 className='dark:text-gray-50 tracking-tight font-heavy text-6xl mb-8 font-medium text-gray-900'>
                        A NEW CHAPTER
                    </h1>
                    <p className='mb-8 text-xl font-normal tracking-tight leading-snug max-w-2xl'>Canada Contenders
                        League is the newest chapter in Canadian Rainbow Six Esports</p>
                    <div className='flex justify-center space-x-8'>
                        <DashboardButton
                            label={'Learn More'}
                            href={'/about'}
                            className={'bg-primary font-heavy hover:bg-red-600 active:bg-red-500'} />
                        <DashboardButton
                            label={'Register Team'}
                            href='/team/register'
                            className={'dark:bg-white dark:hover:bg-gray-50 dark:active:bg-gray-100 dark:text-gray-900 bg-gray-900 text-gray-50 font-heavy'} />
                    </div>
                </div>
            </div>
        </>
    )
}


Index.SEO = {
    url: '/'
}
export default Index