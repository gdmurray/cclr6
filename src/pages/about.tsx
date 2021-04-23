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
                        <div className='content text-alt-2'>The Canada Contenders League, also known as CCL, is a Canadian-based Rainbow Six: Siege league focused on diversifying and developing the competitive scene in Canada.
                        </div>
                    </div>
                    <div>
                        <div className='title'>
                            Our Mission
                        </div>
                        <div className='content text-alt-2'>The CCL staff strives to supply participants with a safe and competitive environment to showcase and develop their skills.
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