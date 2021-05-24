import React from 'react'
import { Image } from '@chakra-ui/react'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'

dayjs.extend(LocalizedFormat)

export interface CMSPost {
    content: string;
    created_at: string;
    metadata: {
        cover_image: {
            imgix_url: string;
            url: string;
        }
    };
    slug: string;
    title: string;
}

export default function Post(post: CMSPost): JSX.Element {
    const { content, title, metadata, created_at } = post
    return (
        <div className='text-content py-4'>
            {metadata.cover_image.imgix_url && (
                <Image alt={'Cover Image'} src={metadata.cover_image.imgix_url} />
            )}
            <div className="py-2 post-content">
                <div className='post-title '>{title}</div>
                <div className='post-date'>{dayjs(created_at).format('LLL')}</div>
                <div className="py-4" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    )
}