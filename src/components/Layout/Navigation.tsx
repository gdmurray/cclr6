import { useRouter } from 'next/router'
import { useAuth } from '@lib/auth'
import React, { useEffect, useState } from 'react'
import {
    Badge,
    Button,
    Collapse,
    Flex,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    useDisclosure,
} from '@chakra-ui/react'
import { FaBars, FaChevronDown, FaChevronLeft, FaTimes } from 'react-icons/fa'
import { useSuspenseNavigation } from './useSuspenseNavigation'
import useTeam from '@lib/useTeam'
import { features } from '@lib/platform/features'
import { useAdminCheck } from '@components/Layout/useAdminCheck'

interface INavItem extends NavItem {
    active: boolean
}

const baseRoutes: NavItem[] = [
    {
        label: 'Home',
        href: '/',
    },
    {
        label: 'Register',
        href: '/team/register',
    },
    {
        label: 'Season Two',
        href: '/seasons/two',
    },
    {
        label: 'Partners',
        href: '/partners',
    },
    {
        label: 'Watch',
        href: '/watch',
    },
    {
        label: 'Posts',
        href: '/posts',
    },
]

const MobileNavigationItem = ({ children, label, onClick, href, subLabel }: INavItem) => {
    const router = useRouter()
    const { navigate, isLoading } = useSuspenseNavigation()
    const { isOpen, onToggle } = useDisclosure()
    if (!children) {
        return (
            <div onClick={onClick ? onClick : () => navigate(label, href)} className="nav-item">
                <span className={`${isLoading(label) ? 'primary-loading' : ''}`}>
                    {label}{' '}
                    {subLabel && subLabel === 'live' && (
                        <Badge variant="solid" colorScheme="red">
                            LIVE
                        </Badge>
                    )}
                </span>
            </div>
        )
    } else {
        return (
            <>
                <div onClick={onToggle} className="nav-item with-children">
                    <div>{label}</div>
                    {isOpen ? <FaChevronDown className="text-base" /> : <FaChevronLeft className="text-base" />}
                </div>
                <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                    <Stack spacing={0}>
                        {children &&
                            children.map((child) => (
                                <div
                                    key={child.label}
                                    onClick={child.onClick ? child.onClick : () => router.push(child.href)}
                                    className="nav-child"
                                >
                                    {child.label}
                                </div>
                            ))}
                    </Stack>
                </Collapse>
            </>
        )
    }
}

const DesktopNavigationItem = ({ children, label, onClick, href, active, subLabel }: INavItem) => {
    const { navigate, isLoading } = useSuspenseNavigation()
    if (!children) {
        if (!onClick) {
            return (
                <div onClick={() => navigate(label, href)}>
                    <div
                        className={`${isLoading(label) ? 'primary-loading' : ''} navigation-item ${
                            active ? 'text-primary' : 'text-gray-900 dark:text-gray-50'
                        }`}
                    >
                        {label}{' '}
                        {subLabel && subLabel === 'live' && (
                            <div
                                style={{
                                    height: '0px',
                                    position: 'relative',
                                    top: '-45px',
                                    left: '45px',
                                }}
                            >
                                <Badge colorScheme="red" variant="solid">
                                    LIVE
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            )
        } else {
            return (
                <div
                    onClick={onClick}
                    className={`navigation-item ${active ? 'text-primary' : 'text-gray-900 dark:text-gray-50'}`}
                >
                    {label}
                </div>
            )
        }
    } else {
        return (
            <Menu>
                <MenuButton
                    style={{
                        outline: 'none',
                    }}
                    className="hover:text-primary profile-button focus:outline-none outline-none uppercase font-heavy font-semibold px-2 text-2xl"
                >
                    {label} <FaChevronDown className="text-sm ml-2" />
                </MenuButton>
                <MenuList className="focus:outline-none outline-none">
                    {children.map((child) => {
                        return (
                            <MenuItem
                                key={child.label}
                                onClick={child.onClick ? child.onClick : () => navigate(label, child.href)}
                            >
                                {child.label}
                            </MenuItem>
                        )
                    })}
                </MenuList>
            </Menu>
        )
    }
}

const mobileScreen = {
    base: 'flex',
    md: 'none',
}

const desktopScreen = {
    base: 'none',
    md: 'flex',
}

interface NavItem {
    label: string
    subLabel?: string
    children?: NavItem[]
    href?: string

    onClick?(): void
}

const MobileNav = ({ routes }: { routes: NavItem[] }) => {
    const { push, pathname, events } = useRouter()
    const { isOpen, onToggle } = useDisclosure()

    useEffect(() => {
        const handleRouteChange = (_url: string): void => {
            if (isOpen) {
                onToggle()
            }
        }

        events.on('routeChangeComplete', handleRouteChange)
        return (): void => {
            events.off('routeChangeComplete', handleRouteChange)
        }
    }, [pathname, isOpen])
    return (
        <Flex display={mobileScreen} className="mobile">
            <div className="navbar">
                <div className="p-2">
                    <img
                        alt="leaf-logo"
                        className="logo-dark"
                        src={'/images/ccl-logo-leaf-white.svg'}
                        onClick={() => push('/')}
                        width="60"
                    />
                    <img
                        alt="leaf-logo"
                        className="logo-light"
                        src={'/images/ccl-logo-leaf-red.svg'}
                        onClick={() => push('/')}
                        width="60"
                    />
                </div>
                <Button px={0} className="focus:outline-none outline-none" aria-label="open-menu" onClick={onToggle}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </Button>
            </div>
            <Collapse in={isOpen}>
                <Stack mt={0} spacing={0} className="nav-list">
                    {routes.map((route) => {
                        return <MobileNavigationItem key={route.label} active={false} {...route} />
                    })}
                </Stack>
            </Collapse>
        </Flex>
    )
}

const DesktopNav = ({ routes }: { routes: NavItem[] }) => {
    const router = useRouter()

    function getActive(href: string): boolean {
        if (router.pathname === href) {
            return true
        }
        if (href) {
            if (href !== '/' && router.pathname.startsWith(href)) {
                return true
            }
        }
        return false
    }

    return (
        <Flex display={desktopScreen} className="desktop">
            <>
                <img
                    alt="leaf-logo"
                    onClick={() => router.push('/')}
                    width="90"
                    className="logo-dark"
                    src={'/images/ccl-logo-redwhite.svg'}
                />
                <img
                    alt="leaf-logo"
                    onClick={() => router.push('/')}
                    width="90"
                    className="logo-light"
                    src={'/images/ccl-logo-redblack.svg'}
                />
            </>
            <div className="flex flex-row space-x-2 lg:space-x-4">
                {routes.map((route) => {
                    return <DesktopNavigationItem key={route.label} {...route} active={getActive(route.href)} />
                })}
            </div>
        </Flex>
    )
}

function getBaseRoutes(isLive: boolean) {
    if (isLive) {
        const liveIndex = baseRoutes.findIndex((elem) => elem.href === '/watch')
        baseRoutes[liveIndex] = Object.assign(baseRoutes[liveIndex], { subLabel: 'live' })
        console.log('is live: ', baseRoutes)
        return baseRoutes
    }
    return baseRoutes
}

export default function Navigation() {
    const { pathname } = useRouter()
    const { user, signOut } = useAuth()
    const { team } = useTeam({ user })
    const [isLive, setIsLive] = useState<boolean>(false)

    const { isAdmin } = useAdminCheck()

    useEffect(() => {
        fetch('/api/twitch/live').then((result) => {
            if (result.ok) {
                result.json().then((response) => {
                    if (response.status === 'live') {
                        setIsLive(true)
                    }
                })
            }
        })
    }, [])

    const getRoutes = (): NavItem[] => {
        if (!features.login) {
            return getBaseRoutes(isLive)
        }
        if (!user) {
            return [
                ...getBaseRoutes(isLive),
                {
                    label: 'Login',
                    href: '/login',
                },
            ]
        } else {
            return [
                ...getBaseRoutes(isLive),
                {
                    label: 'Profile',
                    children: [
                        {
                            label: 'Profile',
                            href: '/profile',
                        },
                        ...(team ? [{ label: 'Team', href: '/team' }] : []),
                        ...(isAdmin ? [{ label: 'Admin', href: '/admin' }] : []),
                        {
                            label: 'Sign Out',
                            onClick: () => {
                                signOut()
                            },
                        },
                    ],
                },
            ]
        }
    }

    const [routes, setRoutes] = useState<NavItem[]>(getRoutes())

    useEffect(() => {
        setRoutes(getRoutes())
    }, [user, team, isAdmin, pathname])

    // const routes = getRoutes()

    return (
        <>
            <DesktopNav routes={routes} />
            <MobileNav routes={routes} />
        </>
    )
}
