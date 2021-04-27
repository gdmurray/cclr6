import React from 'react'
import { FaDiscord, FaYoutube, FaTwitch, FaTwitter } from 'react-icons/fa'
import { useRouter } from 'next/router'

interface FooterLink {
    name: string;
    link: string;
    icon?: React.ReactNode;
}

interface FooterData {
    name: string;
    links: FooterLink[];
}

const FooterData: FooterData[] = [
    {
        name: 'Social',
        links: [
            {
                name: 'Discord',
                link: 'https://google.com',
                icon: <FaDiscord />
            },
            {
                name: 'Twitter',
                link: 'https://twitter.com',
                icon: <FaTwitter />
            },
            {
                name: 'Twitch',
                link: 'https://twitch.tv/',
                icon: <FaTwitch />
            },
            {
                name: 'Youtube',
                link: 'https://youtube.com',
                icon: <FaYoutube />
            }
        ]
    },
    {
        name: 'More',
        links: [
            {
                name: 'About',
                link: '/about'
            },
            {
                name: 'Partners',
                link: '/partners'
            },
            {
                name: 'Watch',
                link: '/watch'
            },
            {
                name: 'Positions',
                link: '/positions'
            }
        ]
    },
    {
        name: 'Help',
        links: [
            {
                name: 'Contact',
                link: '/contact'
            },
            {
                name: 'Privacy Policy',
                link: '/privacy'
            },
            {
                name: 'Rulebook',
                link: '/rules'
            }
        ]
    }
]


export default function Footer(): JSX.Element {
    const { push } = useRouter()
    return (
        <footer className='font-medium bg-gray-50 border-gray-200 dark:bg-gray-900 border-t dark:border-gray-800'>
            <div className='flex flex-col sm:flex-row max-w-6xl mx-auto p-6 py-24'>
                <div className='w-48 my-auto mx-auto pb-16 sm:pb-0'>
                    <>
                        <img alt='leaf-logo' width='150'
                             className='logo-dark mx-auto'
                             src={'/images/ccl-logo-redwhite.png'} />
                        <img alt='leaf-logo' width='150'
                             className='logo-light mx-auto'
                             src={'/images/ccl-logo-redblack.png'} />
                    </>
                </div>
                <div className='flex-grow flex flex-row justify-around'>
                    {FooterData.map((footerColumn) => {
                        return (
                            <div key={footerColumn.name}>
                                <div
                                    className='text-main pl-4 font-bold text-base uppercase tracking-wider mb-2'>{footerColumn.name}</div>
                                <div>
                                    {footerColumn.links.map((sub) => {
                                        if (sub.link.startsWith('/')) {
                                            return (
                                                <div
                                                    key={sub.name}
                                                    onClick={() => push(sub.link)}
                                                    className='py-1 pl-4 w-36 group flex flex-row items-center cursor-pointer hover:text-primary transition-colors duration-200'>
                                                    {sub.icon && (
                                                        <span className='pr-1 text-sm'>{sub.icon}</span>
                                                    )}
                                                    <div
                                                        className='text-alt font-medium group-hover:text-primary transition-colors duration-200'>{sub.name}</div>
                                                </div>
                                            )
                                        }
                                        return (
                                            <a
                                                key={sub.name}
                                                href={sub.link}
                                                className='py-1 pl-4 w-36 group flex flex-row items-center cursor-pointer hover:text-primary transition-colors duration-200'>
                                                {sub.icon && (
                                                    <span className='pr-1 text-sm'>{sub.icon}</span>
                                                )}
                                                <div
                                                    className='text-alt font-medium group-hover:text-primary transition-colors duration-200'>{sub.name}</div>
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='p-4 px-12 bg-gray-100 dark:bg-gray-800'>
                <div className='max-w-6xl mx-auto'>
                    <span className='font-medium text-sm text-alt'>© 2021 Canada Contender League</span>
                </div>
            </div>
            <style jsx>{`
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