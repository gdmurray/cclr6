import React from 'react'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { FaTwitter, FaUnlink } from 'react-icons/fa'
import { useAuth } from '@lib/auth'
import Loader from '@components/Loader'
import { IconButton, Image, Input, Tooltip } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})({})

interface TwitterProvider {
    displayName: string;
    email: string;
    photoURL: string;
    uid: string;
}

const Profile = () => {
    const { Twitter, user, loading } = useAuth()
    if (loading || !user) {
        return (
            <Loader text={'Loading Profile'} />
        )
    }
    console.log('USER: ', user)
    const usersTwitter = (): TwitterProvider => {
        if (user) {
            if ('twitter.com' in user.providers) {
                return user.providers['twitter.com']
            }
        }
        return undefined
    }

    return (
        <div className='page-content'>
            <div className='page-title-sm'>Your Profile</div>
            <div className='flex flex-row p-2 py-4'>
                <div>
                    <Image borderRadius='full' width={75} src={usersTwitter()?.photoURL.replace('_normal', '')}
                           fallbackSrc='https://via.placeholder.com/150?text=Profile' />
                </div>
                <div className='ml-4'>
                    <div className='text-main font-medium text-lg'>
                        <FormControl isRequired={false} isReadOnly={true} mb={1}>
                            <FormLabel>Email</FormLabel>
                            <Input w={250} p={2} isReadOnly={true} variant='unstyled' defaultValue={user.email} />
                        </FormControl>
                    </div>
                    <div className='py-2'>
                        {usersTwitter() ? (
                            <div className='text-alt font-medium text-base flex flex-row items-center'>
                                <div>
                                    <FormControl>
                                        <FormLabel>Twitter Account</FormLabel>
                                        <Input w={200}
                                               p={2}
                                               isReadonly={true}
                                               variant={'unstyled'}
                                               defaultValue={usersTwitter()?.displayName} />
                                    </FormControl>
                                </div>
                                <div className='ml-4'>
                                    <Tooltip label='Unlink Twitter?' hasArrow>
                                        <IconButton onClick={Twitter.unlink} size='sm' colorScheme='twitter'
                                                    aria-label='unlink'
                                                    icon={<FaUnlink />} />
                                    </Tooltip>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={Twitter.link}
                                className='social-button text-gray-50 bg-twitter hover:bg-twitter-darker'>
                                <FaTwitter className='mr-2' />Link Twitter
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

}

Profile.SEO = {
    url: '/profile',
    title: 'User Profile'
}
export default Profile