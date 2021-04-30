import React from 'react'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { FaTwitch, FaTwitter } from 'react-icons/fa'
import { useAuth } from '@lib/auth'
import Loader from '@components/Loader'

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})({})

const Profile = () => {
    const { Twitter, user, loading } = useAuth()
    if (loading || !user) {
        return (
            <Loader text={'Loading Profile'} />
        )
    }
    return (
        <>
            <h2>
                My Profile: {user.uid}
            </h2>
            <div>
                <label>Email</label>
                <div>{user.email}</div>
            </div>
        </>
    )
    return <></>

}

Profile.SEO = {
    url: '/profile',
    title: 'User Profile'
}
export default Profile