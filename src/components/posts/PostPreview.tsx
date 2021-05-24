import React from 'react'
import { CMSPost } from '@components/posts/Post'
import { Image } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import RelativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

dayjs.extend(RelativeTime)

export interface CMSPostPreview extends CMSPost {
    thumbnail: string;
}

export default function PostPreview(post: CMSPostPreview): JSX.Element {
    const { title, slug, created_at, thumbnail } = post
    const { push } = useRouter()
    return (
        <motion.div
            onClick={() => push(`/posts/${slug}`)}
            whileHover={{
                y: -2
            }}
            whileTap={{ scale: 0.98 }} className='group bordered border rounded-xl overflow-hidden cursor-pointer'
            style={{ height: '125px' }}>
            <div className='flex flex-row justify-between h-full'>
                <div className='py-6 px-4 h-full flex flex-col justify-center'>
                    <div className='group-hover:underline text-main text-xl font-semibold'>{title}</div>
                    <div className='text-alt-2 text-sm font-medium'>{dayjs(created_at).fromNow()}</div>
                </div>
                <div>
                    {thumbnail && (
                        <Image height={125} alt='thumbnail' src={thumbnail} />
                    )}
                </div>
            </div>

        </motion.div>
    )
}