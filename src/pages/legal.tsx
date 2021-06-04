import React from 'react'

const Legal = (): JSX.Element => {
    return (
        <div className='page-content max-w-2xl mx-auto'>
            <div className='page-title-sm'>Legal</div>
            <div className='privacy-policy mt-6 '>
                <p className='text-center mb-2'><strong>Notice of Non-Affiliation and Disclaimer</strong></p>
                <p className='leading-6'>&nbsp;&nbsp;&nbsp;&nbsp;We are not affiliated, associated, endorsed
                    by, or in any way officially connected
                    with
                    Ubisoft®, Tom Clancy's Rainbow Six Siege™, FACEIT, or any of their respective subsidiaries or
                    affiliates. The official websites for each can be found below: <br /><br /></p>
                <p>
                    <a target='_blank' rel='noopener'
                       href='https://www.ubisoft.com/en-us/'>https://www.ubisoft.com/en-us/</a><br />
                    <a target='_blank' rel='noopener' href='https://www.faceit.com/'>https://www.faceit.com/</a></p>
                <br />
                <p>The names Ubisoft and Tom Clancy's Rainbow Six Siege™ as well as related names, marks, emblems and
                    images are registered trademarks of their respective owners.</p>
            </div>
        </div>
    )
}

Legal.SEO = {
    url: '/legal',
    title: 'Legal'
}

export default Legal