import React from 'react'
import { CMSPost } from '@components/posts/Post'
import { Image, WrapItem } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import RelativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

dayjs.extend(RelativeTime)

export interface CMSPostPreview extends CMSPost {
    thumbnail: string
    read_time: string
}

export default function PostPreview(post: CMSPostPreview): JSX.Element {
    const { title, slug, created_at, thumbnail, read_time } = post
    const { push } = useRouter()

    return (
        <WrapItem>
            <motion.div
                onClick={() => push(`/posts/${slug}`)}
                style={{ borderTop: '6px solid #e50a25' }}
                whileHover={{
                    y: -2,
                }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer bordered border rounded-md max-w-lg overflow-hidden"
            >
                <div>
                    <Image src={thumbnail} />
                </div>
                <div className="pb-2 pt-1 px-4">
                    <div className="pt-2 pb-4">
                        <div className="group-hover:underline text-main text-2xl font-semibold">{title}</div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="text-alt-2 text-sm font-medium">{dayjs(created_at).fromNow()}</div>
                        <div className="text-alt-2 text-sm font-medium">{read_time}</div>
                    </div>
                </div>
            </motion.div>
        </WrapItem>
    )
}
