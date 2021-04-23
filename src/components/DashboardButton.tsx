import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Spinner } from '@chakra-ui/react'

interface IDashboardButton {
    className?: string;
    children: React.ReactNode;
    useLoader?: boolean;
    href?: string;

    onClick?(): void;
}

const DashboardButton = ({ children, className, onClick, href }: IDashboardButton): JSX.Element => {
    console.log('Dashboard button?:')
    const { push, pathname, events } = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [clicked, setClicked] = useState<boolean>(false)
    useEffect(() => {
        const handleStart = (_: string) => {
            setLoading(true)
        }

        const handleFinish = (_: string) => {
            setLoading(false)
        }

        events.on('routeChangeStart', handleStart)
        events.on('routeChangeComplete', handleFinish)
        return (): void => {
            events.off('routeChangeStart', handleStart)
            events.off('routeChangeComplete', handleFinish)
        }
    }, [pathname])

    const handleClick = (): void => {
        setClicked(true)
        if (href) {
            push(href)
        } else if (onClick) {
            onClick()
        }
    }


    return <motion.button
        onClick={handleClick}
        className={'items-center tracking-wide font-semibold inline-flex text-white border-0 py-2 px-4 focus:outline-none text-lg ' + className}
        whileTap={{ scale: 0.95 }}
    >
        {loading && clicked && (
            <Spinner className='mr-2' size='xs' />
        )}
        {children}
    </motion.button>
}

DashboardButton.defaultProps = {
    className: '',
    children: <></>,
    onClick: () => {
    }
}

export default DashboardButton