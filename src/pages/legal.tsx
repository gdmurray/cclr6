import React from 'react'

const Legal = (): JSX.Element => {
    return (
        <div className="page-content max-w-2xl mx-auto">
            <h1 className="page-title-sm">Legal</h1>
            <div className="privacy-policy mt-6 ">
                <p className="text-center mb-2">
                    <strong>Notice of Non-Affiliation and Disclaimer</strong>
                </p>
                <p className="leading-6">
                    &nbsp;&nbsp;&nbsp;&nbsp;We are not affiliated, associated, endorsed by, or in any way officially
                    connected with Ubisoft®, Tom Clancy&#39;s Rainbow Six Siege™, FACEIT, or any of their respective
                    subsidiaries or affiliates. The official websites for each can be found below: <br />
                    <br />
                </p>
                <p>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.ubisoft.com/en-us/">
                        https://www.ubisoft.com/en-us/
                    </a>
                    <br />
                    <a target="_blank" rel="noopener noreferrer" href="https://www.faceit.com/">
                        https://www.faceit.com/
                    </a>
                </p>
                <br />
                <p>
                    The names Ubisoft and Tom Clancy&#39;s Rainbow Six Siege™ as well as related names, marks, emblems
                    and images are registered trademarks of their respective owners.
                </p>
            </div>
        </div>
    )
}

Legal.SEO = {
    url: '/legal',
    title: 'Legal',
    description: 'CCLR6 Legal declarations for our affiliation with other brands and companies.',
}

export default Legal
