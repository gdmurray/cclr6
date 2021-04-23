import React from 'react'
import { Image } from '@chakra-ui/react'


const About = () => {
    return (
        <div className="page-content">
            <div className='about'>
                <div className='mb-6'>
                    <Image
                        className='mx-auto mb-2'
                        src={'/images/ccl-logo-leaf-red.svg'} alt='CCL-Logo'
                        width={{ base: '100px', md: '140px' }} />
                    <div className='hero-title'>
                        About CCL
                    </div>
                </div>
                <div className='cards'>
                    <div>
                        <div className='title'>
                            Who We Are
                        </div>
                        <div className='content text-alt-2'>"Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do
                            eiusmod tempor incididunt
                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                        </div>
                    </div>
                    <div>
                        <div className='title'>Our
                            Mission
                        </div>
                        <div className='content text-alt-2'>"Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do
                            eiusmod tempor incididunt
                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

About.SEO = {
    title: 'About',
    url: '/about'
}
export default About