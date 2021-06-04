import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Wrap } from '@chakra-ui/react'
import Link from 'next/link'
import { getAllPostsForHome } from '@lib/api/cms'
import PostPreview, { CMSPostPreview } from '@components/posts/PostPreview'
import { GetStaticPropsResult } from 'next'
import Duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs'
import { parse } from 'node-html-parser'

dayjs.extend(Duration)

interface PostsProps {
    posts: CMSPostPreview[]
}

// TODO: Pagination, later problem :), a good problem however

export default function Posts({ posts }: PostsProps): JSX.Element {
    return (
        <div className='page-content'>
            <Breadcrumb fontWeight='medium' fontSize='sm' className='text-main'>
                <BreadcrumbItem>
                    <BreadcrumbLink as={Link} href='/'>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink as={Link} href='/posts'>Posts</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <div className='text-content p-2 py-4 posts'>
                <Wrap spacing='2.5em'>
                    {posts.map((post) => {
                        return (
                            <PostPreview key={post.slug} {...post} />
                        )
                    })}
                </Wrap>
            </div>
        </div>
    )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<{ posts: CMSPostPreview[] }>> {
    let data = await getAllPostsForHome()
    if (data && data.length > 0) {
        data = data.map((elem) => {
            const root = parse(elem.content)
            const wordCount = root.structuredText.trim().split(/\s+/).length + elem.title.split(/\s+/).length
            const duration = dayjs.duration({ seconds: wordCount / 125 * 60 }).asMinutes()
            if (duration > 0 && duration < 0.75) {
                return ({ ...elem, read_time: `~1 Minute Read` })
            } else {
                return ({ ...elem, read_time: `${Math.round(duration)} Minute Read` })
            }
        })
    }
    return {
        props: {
            posts: data || []
        },
        revalidate: 3600
    }
}