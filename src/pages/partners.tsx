import React from 'react'
import { FaTwitter } from 'react-icons/fa'

const Partners = () => {
    return (
        <div className='page-content'>
            <div className='page-title mb-12'>CCLR6 Partners</div>
            <div className='text-center mx-auto max-w-3xl'>
                <img className='mx-auto mb-4' alt='cclr6-logo' src={'/images/ccl-logo-leaf-red.svg'} width='120' />
                <div className='text-3xl font-semibold mb-2'>Currently Looking for Partners!</div>
                <div className='text-alt'>
                    <p className='font-medium text-xl mb-10 text-alt'>
                        CCLR6 is actively searching for partners or sponsors who would like to get involved in
                        trying
                        to
                        showcase and evolve Canadian Rainbow Six: Siege talent.
                    </p>
                    <p className='text-alt font-medium text-2xl'>
                        If this sounds like something you&#39;d be interested in:
                    </p>
                    <div className='text-2xl font-medium'>
                        Send us an email at <a className='text-link font-semibold'
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
                                    className='text-main flex items-center font-bold text-lg social-button bg-twitter px-4 py-2 hover:bg-twitter-darker '><FaTwitter
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