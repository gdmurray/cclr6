import React from 'react'
import { FaDiscord, FaYoutube, FaTwitch, FaTwitter } from 'react-icons/fa'
import config from '@lib/platform/config'
import { useRouter } from 'next/router'
import { Link } from '@chakra-ui/react'
import { LiquipediaIcon } from '@components/Layout/CustomIcons'

interface FooterLink {
    name: string
    link: string
    icon?: React.ReactNode
}

interface FooterData {
    name: string
    links: FooterLink[]
}

const FooterData: FooterData[] = [
    {
        name: 'Social',
        links: [
            {
                name: 'Discord',
                link: config.socials.discord,
                icon: <FaDiscord />,
            },
            {
                name: 'Twitter',
                link: config.socials.twitter,
                icon: <FaTwitter />,
            },
            {
                name: 'Twitch',
                link: config.socials.twitch,
                icon: <FaTwitch />,
            },
            {
                name: 'Youtube',
                link: config.socials.youtube,
                icon: <FaYoutube />,
            },
            {
                name: 'Liquipedia',
                link: 'https://liquipedia.net/rainbowsix/Canada_Contenders_League/2021',
                icon: <LiquipediaIcon />,
            },
        ],
    },
    {
        name: 'More',
        links: [
            {
                name: 'About',
                link: '/about',
            },
            {
                name: 'Partners',
                link: '/partners',
            },
            {
                name: 'Watch',
                link: '/watch',
            },
            {
                name: 'Positions',
                link: '/positions',
            },
            {
                name: 'Blog',
                link: '/posts',
            },
        ],
    },
    {
        name: 'Help',
        links: [
            {
                name: 'Rulebook',
                link: '/rulebook',
            },
            {
                name: 'FAQ',
                link: '/faq',
            },
            {
                name: 'Contact',
                link: '/contact',
            },
            {
                name: 'Privacy Policy',
                link: '/privacy',
            },
            {
                name: 'Legal',
                link: '/legal',
            },
        ],
    },
]

type PoweredByPartner = {
    link: string
    logo_dark: string
    logo_light: string
    alt: string
}
const PoweredBy = ({ partner }: { partner: PoweredByPartner }) => {
    return (
        <div className="mt-6">
            <div className="px-5 text-xs font-semibold text-alt-2 mb-0 antialiased">Powered By</div>
            <a href={partner.link} target="_blank" rel="noopener noreferrer">
                <img
                    alt={partner.alt}
                    className="mx-auto logo-dark cursor-pointer"
                    src={partner.logo_dark}
                    width="150"
                />
                <img
                    alt={partner.alt}
                    className="mx-auto logo-light cursor-pointer"
                    src={partner.logo_light}
                    width="150"
                />
            </a>

            <style jsx>
                {`
                    @media (prefers-color-scheme: light) {
                        .logo-dark {
                            display: none;
                        }
                    }

                    @media (prefers-color-scheme: dark) {
                        .logo-light {
                            display: none;
                        }
                    }
                `}
            </style>
        </div>
    )
}

const UbisoftDisclaimer = (): JSX.Element => {
    return (
        <div style={{ fontSize: '10px' }} className="text-center py-2 px-4 font-semibold text-alt-2 antialiased">
            Unofficial Canadian League, Not affiliated or connected with Ubisoft®, Tom Clancy&#39;s Rainbow Six Siege™,
            FACEIT, or any of their respective subsidiaries or affiliates
        </div>
    )
}

export default function Footer(): JSX.Element {
    const { push } = useRouter()
    return (
        <footer className="font-medium bg-gray-50 border-gray-200 dark:bg-gray-900 border-t dark:border-gray-800">
            <div className="flex flex-col sm:flex-row max-w-6xl mx-auto p-6 py-16">
                <div className="w-48 my-auto mx-auto pb-16 sm:pb-0">
                    <>
                        <img
                            alt="leaf-logo"
                            width="120"
                            className="logo-dark mx-auto"
                            src={'/images/ccl-logo-redwhite.svg'}
                        />
                        <img
                            alt="leaf-logo"
                            width="120"
                            className="logo-light mx-auto"
                            src={'/images/ccl-logo-redblack.svg'}
                        />
                        <PoweredBy
                            partner={{
                                link: 'https://www.firstblood.io/',
                                alt: 'firstblood',
                                logo_light: '/images/firstblood-logo-black.svg',
                                logo_dark: '/images/firstblood-logo-white.svg',
                            }}
                        />
                        <PoweredBy
                            partner={{
                                link: 'https://www.toornament.com',
                                alt: 'toornament',
                                logo_light: '/images/toornament_logo_black.png',
                                logo_dark: '/images/toornament_logo_white.png',
                            }}
                        />
                    </>
                </div>
                <div className="flex-grow flex items-center sm:items-start flex-col sm:flex-row justify-around">
                    {FooterData.map((footerColumn) => {
                        return (
                            <div key={footerColumn.name} className="mt-2">
                                <div className="text-main pl-4 font-bold text-lg uppercase tracking-wider mb-2">
                                    {footerColumn.name}
                                </div>
                                <div>
                                    {footerColumn.links.map((sub) => {
                                        if (sub.link.startsWith('/')) {
                                            return (
                                                <div
                                                    key={sub.name}
                                                    onClick={() => push(sub.link)}
                                                    className="py-1 pl-4 w-36 group flex flex-row items-center cursor-pointer hover:text-primary transition-colors duration-200"
                                                >
                                                    {sub.icon && <span className="pr-1 text-sm">{sub.icon}</span>}
                                                    <div className="text-alt font-medium group-hover:text-primary transition-colors duration-200">
                                                        {sub.name}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return (
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                key={sub.name}
                                                href={sub.link}
                                                className="py-1 pl-4 w-36 group flex flex-row items-center cursor-pointer hover:text-primary transition-colors duration-200"
                                            >
                                                {sub.icon && <span className="pr-1 text-sm">{sub.icon}</span>}
                                                <div className="text-alt font-medium group-hover:text-primary transition-colors duration-200">
                                                    {sub.name}
                                                </div>
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <UbisoftDisclaimer />
            <div className="p-4 px-12 bg-gray-100 dark:bg-gray-800">
                <div className="max-w-6xl mx-auto flex justify-between font-medium text-sm text-alt">
                    <span>© 2021 Canada Contender League</span>
                    <Link href="/legal">Legal</Link>
                </div>
            </div>
            <style jsx>
                {`
                    @media (prefers-color-scheme: light) {
                        .logo-dark {
                            display: none;
                        }
                    }

                    @media (prefers-color-scheme: dark) {
                        .logo-light {
                            display: none;
                        }
                    }
                `}
            </style>
        </footer>
    )
}
