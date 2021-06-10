import { useRouter } from 'next/router'

export default function useRedirect(defaultRedirect = null) {
    const { query, push } = useRouter()

    function getNext(path, customQuery = {}) {
        return {
            pathname: path,
            query: {
                ...query,
                ...customQuery,
            },
        }
    }

    if ('next' in query) {
        return { redirect: query['next']! as string, getNext }
    }

    return { redirect: defaultRedirect ? defaultRedirect : '/', getNext, push }
}
