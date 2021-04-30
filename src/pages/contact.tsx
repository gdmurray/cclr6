import React from 'react'

const Contact = (): JSX.Element => {
    return (
        <div className='page-content'>
            <div className='page-title mb-6'>Contact Us</div>
            <div className="space-y-4">
                <div>
                    <div className="text-2xl font-semibold text-main">For General Inquiries:</div>
                    <div className="text-lg font-medium text-alt">
                        Send us an email at <a className='text-link font-semibold'
                                               href='mailto:support@cclr6.com'>support@cclr6.com</a>
                    </div>
                    <div className="text-xs text-base font-semibold tracking-tight text-alt-2">There is a FAQ Coming Soon!</div>
                </div>
                <div>
                    <div className="text-2xl font-semibold text-main">For Partnership Inquiries:</div>
                    <div className="text-lg font-medium text-alt">
                        Send us an email at <a className='text-link font-semibold'
                                               href='mailto:partners@cclr6.com'>partners@cclr6.com</a>
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-semibold text-main">If you'd like to work with us:</div>
                    <div className="text-lg font-medium text-alt">
                        Send us an email at <a className='text-link font-semibold'
                                               href='mailto:positions@cclr6.com'>positions@cclr6.com</a>
                    </div>
                </div>
                <div>
                    <div className="text-xl font-bold text-main">We look forward to hearing from you!</div>
                </div>
            </div>
        </div>
    )
}

Contact.SEO = {
    url: '/contact',
    title: 'Contact Us'
}

export default Contact