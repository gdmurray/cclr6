import Cosmic from 'cosmicjs'

const BUCKET_SLUG = process.env.COSMIC_BUCKET_SLUG
const READ_KEY = process.env.COSMIC_READ_KEY

export const bucket = Cosmic().bucket({
    slug: BUCKET_SLUG,
    read_key: READ_KEY,
})

const is404 = (error) => /not found/i.test(error.message)

export async function getAllPostsForHome() {
    const params = {
        query: {
            type: 'posts',
        },
        props: 'slug,title,metadata,created_at,thumbnail,content,type',
        sort: '-created_at',
    }
    const data = await bucket.getObjects(params)
    return data.objects
}

export async function getAllPostsWithSlug() {
    const params = {
        type_slug: 'posts',
        props: 'slug',
    }
    const data = await bucket.getObjects(params)
    return data.objects
}

export async function getPost(slug) {
    const result = await bucket
        .getObjects({
            query: {
                type: 'posts',
                slug,
            },
            props: 'slug,title,content,metadata,created_at',
        })
        .catch((error) => {
            if (error.status === 404) {
                return
            }
            throw error
        })

    if (!result) {
        return {
            post: undefined,
        }
    }

    const [post] = result.objects

    return {
        post,
    }
}

export async function getPartners() {
    const params = {
        query: {
            type: 'partners',
        },
        status: 'published',
        props: 'status,slug,title,content,metadata',
    }
    const data = await bucket.getObjects(params)
    return data.objects
}
