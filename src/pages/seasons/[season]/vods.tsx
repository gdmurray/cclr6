import React, { useRef } from 'react'
import SeasonLayout from '@components/season/SeasonLayout'
import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import { getSeasonPaths } from '@lib/season/common'
import { getYoutubeClient } from '@lib/api/youtube'
import { Image } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

dayjs.extend(relativeTime)

export async function getStaticProps(): Promise<GetStaticPropsResult<any>> {
    const youtubeClient = await getYoutubeClient()
    const response = await youtubeClient.playlistItems.list({
        part: ['id,snippet,contentDetails,status'],
        playlistId: 'PLNLN3F4joeHDddK3kmrOXOCwdiKmEzOXD',
        maxResults: 50,
    })
    response.data.items.forEach((item) => {
        console.log(item)
    })
    return {
        props: {
            vods: response.data.items,
        },
        revalidate: 3600,
    }
}

const Video = ({ video }: { video: any }): JSX.Element => {
    const ref = useRef<HTMLAnchorElement>()

    const url = `https://www.youtube.com/watch?v=${video.contentDetails.videoId}`
    return (
        <motion.div
            onClick={() => {
                if (ref.current) {
                    ref.current.click()
                }
            }}
            key={video.id}
            whileHover={{
                y: -2,
            }}
            whileTap={{ scale: 0.98 }}
            className="bordered border dark:hover:border-gray-700 hover:border-gray-400 hover:shadow-sm rounded-xl max-w-sm w-sm my-4 ml-2"
        >
            <a ref={ref} href={url} target="_blank" rel="noopener noreferrer" />
            <div
                className="flex flex-col p-2 max-w-xs absolute cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.6)' }}
            >
                <span className="text-subtitle">{video.snippet.title}</span>
                <span className="text-subtitle-description">{dayjs(video.snippet.publishedAt).fromNow()}</span>
            </div>
            <Image className="w-full rounded-xl cursor-pointer" src={video.snippet.thumbnails.medium.url} />
        </motion.div>
    )
}

const SeasonVods = ({ vods = [] }: { vods: any[] }): JSX.Element => {
    return (
        <div className="max-w-6xl mx-auto">
            {vods.length === 0 && <div className="text-alt-2 font-medium">No vods found for this season!</div>}
            <div className="flex flex-wrap -mx-4 justify-evenly">
                {vods
                    .filter((elem) => elem.status.privacyStatus === 'public')
                    .sort((a, b) => {
                        return dayjs(a.snippet.publishedAt).isAfter(dayjs(b.snippet.publishedAt)) ? -1 : 1
                    })
                    .map((video) => (
                        <Video video={video} />
                    ))}
            </div>
        </div>
    )
}

SeasonVods.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonVods

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const paths = getSeasonPaths('vods')
    return {
        paths: paths,
        fallback: true,
    }
}
