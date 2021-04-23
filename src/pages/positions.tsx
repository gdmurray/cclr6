import Layout from '../components/Layout/Layout'
import BasicMeta from '../components/meta/BasicMeta'
import OpenGraphMeta from '../components/meta/OpenGraphMeta'
import TwitterCardMeta from '../components/meta/TwitterCardMeta'
import React, { useEffect, useState } from 'react'
import { getAvailablePositions } from '../lib/api/getAvailablePositions'
import { FaChevronRight } from 'react-icons/fa'
import { Skeleton, Spinner, Stack } from '@chakra-ui/react'

import { motion } from 'framer-motion'
import Loader from '../components/Loader'

interface IPosition {
    name: string;
    description: string;
    link: string;
}

const Position = ({ name, description, link }) => {

    function openApplication(link: string): void {
        window.open(link, '_blank').focus()
    }

    return (
        <motion.div
            className='bordered hover:border-2 hover:shadow-sm border rounded-xl p-6 cursor-pointer flex flex-row justify-between'
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
const Positions = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<IPosition[]>([])

    useEffect(() => {
        fetch('/api/positions', {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            result.json().then(data => {
                const { positions } = data
                setLoading(false)
                setData(positions)
            })
        })
    }, [])

    return (
        <>
            <div className='px-6 pt-1 font-bold text-xl dark:text-gray-200 text-gray-800'>
                Positions available for CCL
            </div>
            <div className='px-6 space-y-4 py-8'>
                {loading && (
                    <Loader text={'Loading Positions'} />
                )}
                {data.map((position) => {
                    return (
                        <Position key={position.name} {...position} />
                    )
                })}
            </div>
        </>
    )
}

export default Positions

