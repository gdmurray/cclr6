import React, { useEffect, useState } from 'react'
import { getRulebook } from '@lib/api/getRulebook'
import { GetStaticProps } from 'next'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import { LINE_EXPRESSION } from '@lib/utils'
import { FaLink } from 'react-icons/fa'
import { Tooltip, useClipboard, useToast } from '@chakra-ui/react'

import { getHostName } from '@lib/utils'

dayjs.extend(LocalizedFormat)

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

const Rulebook = ({ content, tableOfContents, modifiedTime }: RulesProps): JSX.Element => {
    const [copyValue, setCopyValue] = useState<string>()
    const { hasCopied, onCopy } = useClipboard(copyValue)
    const toast = useToast()
    useEffect(() => {
        if (copyValue && !hasCopied) {
            onCopy()
            toast({
                title: 'Copied to Clipboard!',
                duration: 1000,
                position: 'top',
            })
        }
    }, [copyValue])

    const copyLink = (id) => {
        const link = `${getHostName()}/rulebook#${id}`
        setCopyValue(link)
    }
    return (
        <div className="page-content">
            <div className="rulebook text-content">
                <>
                    <p className={content[0].className}>{content[0].content}</p>
                    <div className="table-of-contents">
                        <div className="table-title">Table of Contents</div>
                        <div className="table-content">
                            {tableOfContents.map((section, idx) => {
                                const sectionTitle = section.section.content.split('-')
                                sectionTitle.shift()
                                return (
                                    <div key={section.section.id} className="table-block">
                                        <a className="table-section" href={`#${section.section.id}`}>
                                            {idx + 1}. {sectionTitle.join(' ')}
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
                {content.map(({ id, className, content }, index) => {
                    const key = `line-${index}`
                    if (className === 'section') {
                        return (
                            <h1 id={id} key={key} className={className}>
                                {content}
                            </h1>
                        )
                    }
                    if (className === 'subsection') {
                        return (
                            <h2 id={id} key={key} className={className}>
                                {content}{' '}
                                <Tooltip
                                    label="Copy to Clipboard"
                                    placement="right"
                                    colorScheme="blackAlpha"
                                    hasArrow={true}
                                >
                                    <span>
                                        <FaLink
                                            className="ml-2 text-sm cursor-pointer hover:text-primary transition-colors duration-150"
                                            onClick={() => copyLink(id)}
                                        />
                                    </span>
                                </Tooltip>
                            </h2>
                        )
                    }
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

Rulebook.SEO = {
    url: '/rulebook',
    title: 'Rulebook',
}

export default Rulebook
