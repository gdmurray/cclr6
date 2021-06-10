import React from 'react'
import { getRulebook } from '@lib/api/getRulebook'
import { GetStaticProps } from 'next'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'

dayjs.extend(LocalizedFormat)

const LINE_EXPRESSION = /\r\n|\n\r|\n|\r/g
const SUBSECTION_EXPRESSION = /^\d+\.\d+/g

interface RuleItem {
    id?: string
    content: string
    className: 'title' | 'section' | 'subsection' | 'text' | 'text-indent' | string
}

interface TableBlock {
    section: RuleItem
    subsections: RuleItem[]
}

export const getStaticProps: GetStaticProps = async () => {
    const { data, modifiedTime } = await getRulebook()
    const lineData = data.split(LINE_EXPRESSION)
    const pageContent: RuleItem[] = lineData
        .map((line, index) => {
            if (index === 0) {
                return {
                    className: 'title',
                    content: line,
                }
            }

            if (line.startsWith('Section')) {
                const sectionSplit = line.split('-') //.shift() //.replace(' ', '-');
                sectionSplit.shift()
                const sectionId = sectionSplit[0].trim().replace(/\s+/g, '-').toLowerCase()
                return {
                    id: `section-${sectionId}`,
                    className: 'section',
                    content: line,
                }
            }

            const subsectionMatches = line.match(SUBSECTION_EXPRESSION)
            if (subsectionMatches && subsectionMatches.length === 1) {
                const [subSection] = subsectionMatches
                if (line.startsWith(subSection)) {
                    const subSectionId = line.replace(`${subSection} -`, '').trim().replace(/\s+/g, '-').toLowerCase()
                    return {
                        id: `subsection-${subSectionId}`,
                        className: 'subsection',
                        content: line,
                    }
                }
            }

            if (line.startsWith('*')) {
                return {
                    className: 'text',
                    content: line.replace('*', '•'),
                }
            }

            if (line.startsWith('   *')) {
                return {
                    className: 'text-indent',
                    content: line.replace('*', '•'),
                }
            }

            if (line !== '') {
                return {
                    className: 'text',
                    content: line,
                }
            }
        })
        .filter((elem) => elem !== undefined)

    const tableOfContents = []
    let currentSection: RuleItem = null
    let activeTable: TableBlock = null
    pageContent
        .filter((item) => item.id !== undefined)
        .forEach((elem) => {
            if (elem.className === 'section') {
                if (!currentSection) {
                    currentSection = elem
                    activeTable = {
                        section: elem,
                        subsections: [],
                    }
                } else if (currentSection.id !== elem.id) {
                    tableOfContents.push(activeTable)
                    activeTable = {
                        section: elem,
                        subsections: [],
                    }
                }
            }
            if (elem.className === 'subsection') {
                activeTable.subsections.push(elem)
            }
        })
    return {
        props: {
            modifiedTime,
            tableOfContents,
            content: pageContent,
        },
        revalidate: 1800,
    }
}

interface RulesProps {
    content: RuleItem[]
    modifiedTime: string
    tableOfContents: TableBlock[]
}

const useContents = true
const Rules = ({ content, tableOfContents, modifiedTime }: RulesProps): JSX.Element => {
    const getTableOfContents = () => {
        if (useContents) {
            return (
                <>
                    <p className={content[0].className}>{content[0].content}</p>
                    <div className="table-of-contents">
                        <div className="table-title">Table of Contents</div>
                        <div className="table-content">
                            {tableOfContents.map((section) => {
                                return (
                                    <div key={section.section.id} className="table-block">
                                        <a className="table-section" href={`#${section.section.id}`}>
                                            {section.section.content}
                                        </a>
                                        <div className="table-subsections">
                                            {section.subsections.map((subsection) => {
                                                return (
                                                    <a key={subsection.id} href={`#${subsection.id}`}>
                                                        {subsection.content}
                                                    </a>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            )
        }
    }
    return (
        <div className="page-content">
            <div className="rulebook text-content">
                {getTableOfContents()}
                {content.map(({ id, className, content }, index) => {
                    const key = `line-${index}`
                    return (
                        <p id={id} key={key} className={className}>
                            {content}
                        </p>
                    )
                })}
                <div className="w-full text-right font-medium text-xs text-alt-2">
                    Last Updated: {dayjs(modifiedTime).format('LLL')}
                </div>
            </div>
            <style global jsx>
                {`
                    html {
                        scroll-behavior: smooth;
                    }
                `}
            </style>
        </div>
    )
}

Rules.SEO = {
    url: '/rules',
    title: 'Rulebook',
}

export default Rules

// {content.filter(elem => elem.id !== undefined).map(({ id, className, content }) => {
//     if (className === 'section') {
//         return <a className='table-section' key={id} href={`#${id}`}>{content}</a>
//     }
//     if (className === 'subsection') {
//         return <a className='table-subsection' key={id} href={`#${id}`}>{content}</a>
//     }
// })}
