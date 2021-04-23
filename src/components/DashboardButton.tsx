import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Spinner } from '@chakra-ui/react'
import { useSuspenseNavigation } from './Layout/useSuspenseNavigation'

interface IDashboardButton {
    label: string;
    className?: string;
    children?: React.ReactNode;
    useLoader?: boolean;
    href?: string;

    onClick?(): void;
}


// todo: fix unmount

const DashboardButton = ({ label, className, href }: IDashboardButton): JSX.Element => {
    const { navigate, isLoading } = useSuspenseNavigation()
    return <motion.button
        onClick={() => navigate(label, href)}
        className={'items-center tracking-wide font-semibold inline-flex text-white border-0 py-2 px-4 focus:outline-none text-lg ' + className}
        whileTap={{ scale: 0.95 }}
        whileHover={{ y: -1 }}
    >
        {isLoading(label) && (
            <Spinner className='mr-2' size='xs' />
        )}
        {label}
    </motion.button>
}

DashboardButton.defaultProps = {
    className: '',
    label: '',
    children: <></>,
    onClick: () => {
    }
}

export default DashboardButton