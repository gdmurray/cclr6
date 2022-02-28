import React from 'react'
import { FaLink, FaTwitter } from 'react-icons/fa'
import { IconButton, Image, Link, useColorMode } from '@chakra-ui/react'
import { GetStaticPropsResult } from 'next'
import { getPartners } from '@lib/api/cms'

export async function getStaticProps(): Promise<GetStaticPropsResult<any>> {
    const partners = await getPartners()
    return {
        props: {
            partners,
        },
        revalidate: 3600,
    }
}

type Logo = {
    url: string | null
    imgix_url: string | null
}
type Partner = {
    title: string
    content: string
    metadata: {
        logo: Logo
        logo_dark: Logo
        twitter: string
        website: string
    }
}

function getPartnerLogo(partner: Partner, colorMode: string) {
    if (partner.metadata.logo_dark.url != null) {
        if (colorMode === 'dark') {
            return partner.metadata.logo_dark.url
        }
    }
    return partner.metadata.logo.url
}

const PartnerLinks = ({ partner }: { partner: Partner }): JSX.Element => {
    return (
        <div className="flex flex-row space-x-2 justify-center mb-2">
            {partner.metadata.twitter.length > 0 && (
                <IconButton
                    size="sm"
                    key={partner.metadata.twitter}
                    isRound={true}
                    type="button"
                    className="twitter-button"
                    aria-label={'Twitter'}
                >
                    <Link isExternal={true} href={partner.metadata.twitter}>
                        <FaTwitter color={'white'} />
                    </Link>
                </IconButton>
            )}
            {partner.metadata.website.length > 0 && (
                <IconButton
                    size="sm"
                    key={partner.metadata.website}
                    isRound={true}
                    type="button"
                    className="primary-button"
                    aria-label={'Website'}
                >
                    <Link isExternal={true} href={partner.metadata.website}>
                        <FaLink color={'white'} />
                    </Link>
                </IconButton>
            )}
        </div>
    )
}

const Partner = ({ partner }: { partner: Partner }): JSX.Element => {
    const { colorMode } = useColorMode()
    return (
        <div className="flex flex-col justify-start w-full md:w-1/2 xl:w-1/3 px-4 text-center my-4" key={partner.title}>
            <div className="flex flex-col justify-center" style={{ height: 200 }}>
                <Image
                    className="mx-auto cursor-pointer"
                    width={'auto'}
                    maxW={200}
                    maxH={200}
                    src={getPartnerLogo(partner, colorMode)}
                />
            </div>
            <div className="py-1 text-main text-lg font-semibold text-center">{partner.title}</div>
            <PartnerLinks partner={partner} />
            <div
                className="text-alt text-sm font-medium text-center max-w-xs mx-auto"
                dangerouslySetInnerHTML={{ __html: partner.content }}
            />
        </div>
    )
}

const MorePartnersSection = (
    <div className="text-center mx-auto max-w-3xl">
        <div className="text-3xl font-semibold mb-2">Currently Looking for Partners!</div>
        <div className="text-alt">
            <p className="font-medium text-xl mb-10 text-alt">
                CCLR6 is actively searching for partners or sponsors who would like to get involved in trying to
                showcase and develop the Canadian Rainbow Six: Siege scene.
            </p>
            <p className="text-alt font-medium text-2xl">If this sounds like something you&#39;d be interested in:</p>
            <div className="text-2xl font-medium">
                Send us an email at{' '}
                <a className="text-link font-semibold hover:underline" href="mailto:partners@cclr6.com">
                    partners@cclr6.com
                </a>
            </div>
            <div className="my-8 font-medium text-lg max-w-lg mx-auto">
                <h2 className="divider">or</h2>
            </div>
            <div className="flex justify-center">
                <a
                    href="https://twitter.com/messages/compose?recipient_id=1384309303599714305"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="text-white mr-2 flex items-center font-bold text-lg social-button bg-twitter px-4 py-2 hover:bg-twitter-darker ">
                        <FaTwitter className="mr-2" /> DM us on Twitter
                    </span>
                </a>
            </div>
            <div className="text-alt font-bold text-xl mt-3">at @CCLR6S</div>
        </div>
        <style jsx>
            {`
                .divider {
                    display: flex;
                    flex-direction: row;
                }

                .divider:before {
                    margin-right: 10px !important;
                }

                .divider:after {
                    margin-left: 10px !important;
                }

                .divider:before,
                .divider:after {
                    content: '';
                    flex: 1 1;
                    border-bottom: 1px solid #78716c;
                    margin: auto;
                }
            `}
        </style>
    </div>
)

const Partners = ({ partners }: { partners: Partner[] }) => {
    return (
        <div className="page-content mb-6">
            <h1 className="page-title mb-6">CCLR6 Partners</h1>
            <div className="container">
                <div className="flex flex-wrap -mx-4">
                    {partners.map((partner) => (
                        <Partner partner={partner} />
                    ))}
                </div>
            </div>
            {/*<div className="text-center max-w-6xl mx-auto pt-12 pb-24">*/}
            {/*    */}
            {/*</div>*/}
            {MorePartnersSection}
        </div>
    )
}

Partners.SEO = {
    title: 'Partners',
    url: '/partners',
    description: 'Partners who are dedicated to developing the Canadian Rainbow Six Esports Scene.',
}

export default Partners
