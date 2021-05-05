import React from 'react'
import { getRulebook } from '@lib/api/getRulebook'
import { GetStaticProps } from 'next'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'

dayjs.extend(LocalizedFormat)

const LINE_EXPRESSION = /\r\n|\n\r|\n|\r/g
const SUBSECTION_EXPRESSION = /^\d+\.\d+/g

export const getStaticProps: GetStaticProps = async (context) => {
    const { data, modifiedTime } = await getRulebook()
    const lineData = data.split(LINE_EXPRESSION)
    return {
        props: {
            modifiedTime,
            content: lineData
        },
        revalidate: 1800
    }
}

interface RulesProps {
    content: string[];
    modifiedTime: string;
}


const Rules = ({ content, modifiedTime }: RulesProps): JSX.Element => {
    return (
        <div className='page-content'>
            <div className='rulebook text-content'>
                {content.map((line, index) => {
                    const key = `line-${index}`
                    if (index === 0) {
                        return <p key={key} className='title'>{line}</p>
                    }
                    if (line.startsWith('Section')) {
                        return <p key={key} className='section'>{line}</p>
                    }
                    const subsectionMatches = line.match(SUBSECTION_EXPRESSION)
                    if (subsectionMatches && subsectionMatches.length === 1) {
                        const [subSection] = subsectionMatches
                        if (line.startsWith(subSection)) {
                            return <p key={key} className='subsection'>{line}</p>
                        }
                    }
                    if (line.startsWith('*')) {
                        return <p key={key} className='text'>
                            {line.replace('*', '•')}
                        </p>
                    }
                    if (line.startsWith('   *')) {
                        return <p key={key} className='text left-indent'>
                            {line.replace('*', '•')}
                        </p>
                    }
                    if (line !== '') {
                        return <p key={key} className='text'>{line}</p>
                    }
                })}
                <div className='w-full text-right font-medium text-xs text-alt-2'>Last
                    Updated: {dayjs(modifiedTime).format('LLL')}</div>
            </div>
        </div>
    )
}

Rules.SEO = {
    url: '/rules',
    title: 'Rulebook'
}

export default Rules