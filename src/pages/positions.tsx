import React, { useEffect, useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Loader from '../components/Loader'
import { GetStaticProps } from 'next'
import { getAvailablePositions } from '@lib/api/getAvailablePositions'

interface IPosition {
    name: string;
    description: string;
    link: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
    const positions = await getAvailablePositions()
    return {
        props: {
            positions: positions.filter(position => position.active)
        },
        revalidate: 120
    }
}

const Position = ({ name, description, link }) => {

    function openApplication(link: string): void {
        window.open(link, '_blank').focus()
    }

    return (
        <motion.div
            className='bordered dark:hover:border-gray-700 hover:border-gray-400 hover:shadow-sm border rounded-xl p-6 cursor-pointer flex flex-row justify-between'
            onClick={() => openApplication(link)}
            whileHover={{
                y: -2
            }}
            whileTap={{ scale: 0.98 }}
        >
            <div>
                <div className='text-xl dark:text-gray-200 text-gray-800 font-semibold'>
                    {name}
                </div>
                <div className='text-md dark:text-gray-400 font-normal text-gray-600'>
                    {description}
                </div>
            </div>
            <div className='flex items-center pl-2'>
                <FaChevronRight />
            </div>
        </motion.div>
    )
}

const Positions = ({ positions = [] }: { positions: IPosition[] }) => {
    return (
        <div className='page-content'>
            <div className='page-title mb-6'>CCLR6 Positions</div>
            <div className='px-6 space-y-4 py-8 max-w-7xl mx-auto'>
                {positions.map((position) => {
                    return (
                        <Position key={position.name} {...position} />
                    )
                })}
            </div>
        </div>
    )
}

Positions.SEO = {
    url: '/positions',
    title: 'Positions'
}
export default Positions

