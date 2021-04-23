import BasicMeta from '../../components/meta/BasicMeta'
import OpenGraphMeta from '../../components/meta/OpenGraphMeta'
import TwitterCardMeta from '../../components/meta/TwitterCardMeta'
import React from 'react'
import { AuthAction, withAuthSSR } from '../../lib/withSSRAuth'


export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_APP,
    appPageURL: '/register'
})({})

const Register = () => {
    return (
        <>
            <BasicMeta url={'/team/register'} />
            <OpenGraphMeta url={'/team/register'} />
            <TwitterCardMeta url={'/team/register'} />
            <div>
                Register Team for CCL
            </div>
        </>
    )
}


export default Register
