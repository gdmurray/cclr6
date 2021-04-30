import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Spinner } from '@chakra-ui/react'
import { useSuspenseNavigation } from './Layout/useSuspenseNavigation'
import { Features, features } from '@lib/features'

interface IDashboardButton {
    label: string;
    className?: string;
    children?: React.ReactNode;
    useLoader?: boolean;
    href?: string;

    onClick?(): void;
}


// todo: fix unmount

function useIsMounted() {
    const isMounted = useRef(false)

    // @ts-ignore
    useEffect(() => {
        isMounted.current = true
        return () => isMounted.current = false
    }, [])

    return isMounted
}

type MotionButtonProps =
    | { whileTap: any; whileHover: any }
    | { whileTap?: never; whileHover?: never }
const DashboardButton = ({ label, children, className, href }: IDashboardButton): JSX.Element => {
    const { navigate, isLoading } = useSuspenseNavigation()
    const isMounted = useIsMounted()

    const buttonClick = () => {
        if (Features.isRouteValid(href)) {
            navigate(label, href)
        }
    }

    // const props = Features.isRouteValid(href) ? {
    //     whileTap: { scale: 0.95 },
    //     whileHover: { y: -1 }
    // } : { whileHover: undefined, whileTap: undefined }

    if (isMounted) {
        return <motion.button
            onClick={buttonClick}
            style={{
                maxHeight: '44px !important'
            }}
            className={'items-center tracking-wide font-semibold inline-flex text-white border-0 py-2 px-4 focus:outline-none text-lg ' + className}

            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -1 }}
        >
            {isLoading(label) && (
                <Spinner className='mr-2' size='xs' />
            )}
            {children}
        </motion.button>
    }
    return <></>

}

DashboardButton.defaultProps = {
    className: '',
    label: '',
    children: <></>,
    onClick: () => {
    }
}

export default DashboardButton