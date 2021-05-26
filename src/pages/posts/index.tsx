import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import Link from 'next/link'
import { getAllPostsForHome } from '@lib/api/cms'
import PostPreview, { CMSPostPreview } from '@components/posts/PostPreview'

interface PostsProps {
    posts: CMSPostPreview[]
}

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
            <div className='text-content py-4 space-y-4'>
                {posts.map((post) => {
                    return (
                        <PostPreview key={post.slug} {...post} />
                    )
                })}
            </div>
        </div>
    )
}

export async function getStaticProps() {
    const data = await getAllPostsForHome()
    return {
        props: {
            posts: data || []
        }
    }
}