import React from 'react'
import { FaLink, FaTwitter } from 'react-icons/fa'
import partners from '@lib/models/partners'
import { IconButton, Image, Link } from '@chakra-ui/react'

const Partners = () => {
    return (
        <div className='page-content mb-6'>
            <div className='page-title mb-6'>CCLR6 Partners</div>
            <div className='text-center max-w-6xl mx-auto pt-12 pb-24'>
                {partners.map((partner) => {
                    return (
                        <div className='text-center' key={partner.name}>
                            <Image className='mx-auto' width={150} src={partner.image} />
                            <div className='py-1 text-main text-lg font-semibold text-center'>{partner.name}</div>
                            <div
                                className='text-alt text-sm font-medium text-center max-w-xs mx-auto'>{partner.description}</div>
                            <div className='flex flex-row space-x-2 justify-center py-1'>
                                {Object.keys(partner.links).map((key) => {
                                    if (partner.links[key]) {
                                        if (key === 'twitter') {
                                            return (
                                                <IconButton size='sm'
                                                            key={key}
                                                            isRound={true}
                                                            type='button'
                                                            className='twitter-button'
                                                            aria-label={'Twitter'}>
                                                    <Link isExternal={true} href={partner.links[key]}>
                                                        <FaTwitter color={'white'} />
                                                    </Link>
                                                </IconButton>
                                            )
                                        }
                                        if (key === 'website') {
                                            return (
                                                <IconButton size='sm'
                                                            key={key}
                                                            isRound={true}
                                                            type='button'
                                                            className='primary-button'
                                                            aria-label={'Website'}>
                                                    <Link isExternal={true} href={partner.links[key]}>
                                                        <FaLink />
                                                    </Link>
                                                </IconButton>
                                            )

                                        }
                                    }
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className='text-center mx-auto max-w-3xl'>
                <div className='text-3xl font-semibold mb-2'>Currently Looking for Partners!</div>
                <div className='text-alt'>
                    <p className='font-medium text-xl mb-10 text-alt'>
                        CCLR6 is actively searching for partners or sponsors who would like to get involved in
                        trying
                        to
                        showcase and develop the Canadian Rainbow Six: Siege scene.
                    </p>
                    <p className='text-alt font-medium text-2xl'>
                        If this sounds like something you&#39;d be interested in:
                    </p>
                    <div className='text-2xl font-medium'>
                        Send us an email at <a className='text-link font-semibold hover:underline'
                                               href='mailto:partners@cclr6.com'>partners@cclr6.com</a>
                    </div>
                    <div className='my-8 font-medium text-lg max-w-lg mx-auto'>
                        <h2 className='divider'>
                            or
                        </h2>
                    </div>
                    <div className='flex justify-center'>
                        <a
                            href='https://twitter.com/messages/compose?recipient_id=1384309303599714305'
                            target='_blank' rel='noopener'
                        >
                                <span
                                    className='text-white mr-2 flex items-center font-bold text-lg social-button bg-twitter px-4 py-2 hover:bg-twitter-darker '><FaTwitter
                                    className='mr-2' /> DM us on Twitter</span>
                        </a>
                    </div>
                    <div className='text-alt font-bold text-xl mt-3'>
                        at @CCLR6S
                    </div>
                </div>
                <style jsx>{`

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
                    content: "";
                    flex: 1 1;
                    border-bottom: 1px solid #78716C;
                    margin: auto;
                  }
                `}
                </style>
            </div>

        </div>
    )
}

Partners.SEO = {
    title: 'Partners',
    url: '/partners'
}

export default Partners