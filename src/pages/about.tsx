import React from 'react'
import { Image } from '@chakra-ui/react'

const About = () => {
    return (
        <div className="page-content">
            <div className="about">
                <div id="about">
                    <div className="mb-6">
                        <Image
                            className="mx-auto mb-2"
                            src={'/images/ccl-logo-leaf-red.svg'}
                            alt="CCL-Logo"
                            width={{ base: '100px', md: '140px' }}
                        />
                        <div className="hero-title">About CCL</div>
                    </div>
                    <div className="cards">
                        <div>
                            <div className="title">Who We Are</div>
                            <div className="content text-alt-2">
                                The Canada Contenders League, also known as CCL, is a Canadian-based Rainbow Six: Siege
                                league focused on diversifying and developing the competitive scene in Canada. We are
                                all fans and players of Rainbow Six: Siege Esports, and want to see re-emergence of the
                                talent-packed Canadian competitive scene.
                            </div>
                        </div>
                        <div>
                            <div className="title">Our Mission</div>
                            <div className="content text-alt-2">
                                The CCL staff strives to supply participants with a safe and competitive environment to
                                showcase and develop their skills. We want to pick up where the Canadian scene left off,
                                and continue evolving our competitive landscape to show that we have what it takes.
                            </div>
                        </div>
                    </div>
                </div>
                <div id="how-it-works">
                    <div className="mt-24 md:mt-36 mb-6">
                        <div className="hero-title">How it works</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

About.SEO = {
    title: 'About',
    url: '/about',
}
export default About
