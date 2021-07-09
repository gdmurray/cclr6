import React from 'react'
import { getAllPostsWithSlug, getPost } from '@lib/api/cms'
import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import Post, { CMSPost } from '@components/posts/Post'
import { useRouter } from 'next/router'
import EmptyState from '@components/EmptyState'
import { FcBrokenLink } from 'react-icons/fc'
import Loader from '@components/Loader'
import Link from 'next/link'

interface PostProps {
    post: CMSPost
}

export default function PostPage(props: PostProps): JSX.Element {
    const router = useRouter()
    const { post } = props
    if (!router.isFallback && !post?.slug) {
        return (
            <div className="page-content">
                <Breadcrumb fontWeight="medium" fontSize="sm" className="text-main">
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} href="/">
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} href="/posts">
                            Posts
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <>
                    <EmptyState icon={<FcBrokenLink />} text={'Error 404: Post Not Found!'} />
                </>
            </div>
        )
    }
    return (
        <div className="page-content max-w-5xl mx-auto">
            {router.isFallback ? (
                <div>
                    <Loader text="Loading..." />
                </div>
            ) : (
                <>
                    <Breadcrumb fontWeight="medium" fontSize="sm" className="text-main">
                        <BreadcrumbItem>
                            <BreadcrumbLink as={Link} href="/">
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink as={Link} href="/posts">
                                Posts
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink as={Link} href={`/post/${post?.slug}`}>
                                {post?.title}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Post {...post} />
                </>
            )}
        </div>
    )
}

export async function getStaticProps({ params }): Promise<GetStaticPropsResult<{ post: CMSPost }>> {
    const data = await getPost(params.slug)

    function getSEO(data: CMSPost) {
        type SEO = { url: string; title: string; image?: string }
        if (data) {
            const seo: SEO = {
                title: data.title,
                image: null,
                url: `/posts/${data.slug}`,
            }
            if (data.metadata.cover_image.imgix_url) {
                seo.image = data.metadata.cover_image.imgix_url
            }
            return { SEO: seo }
        }
        return {}
    }

    return {
        props: {
            post: {
                ...data.post,
            },
            ...getSEO(data.post),
        },
        revalidate: 3600,
    }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const allPosts = (await getAllPostsWithSlug()) || []
    return {
        paths: allPosts.map((post) => `/posts/${post.slug}`),
        fallback: 'blocking',
    }
}
