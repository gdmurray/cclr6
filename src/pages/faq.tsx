import { GetStaticProps } from 'next'
import { LINE_EXPRESSION } from '@lib/utils'
import { getFAQ } from '@lib/api/getFAQ'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { Link, useDisclosure } from '@chakra-ui/react'

dayjs.extend(LocalizedFormat)

interface FAQItem {
    question: string
    answer: string
}

interface FAQProps {
    data: FAQItem[]
    modifiedTime: string
}

export const getStaticProps: GetStaticProps<FAQProps> = async () => {
    const { data, modifiedTime } = await getFAQ()
    const lineData = data.split(LINE_EXPRESSION).map((elem) => elem.trim())
    const items: FAQItem[] = []

    let activeQuestion: string = null
    for (let i = 0; i < lineData.length; i += 1) {
        const line = lineData[i]
        // Question
        if (line.startsWith('Q:')) {
            activeQuestion = line.replace('Q: ', '').trim()
        }
        if (line.startsWith('A: ')) {
            const answer = line.replace('A: ', '').trim()
            items.push({
                question: activeQuestion,
                answer: answer,
            })
            activeQuestion = null
        }
    }

    return {
        props: {
            data: items,
            modifiedTime,
        },
    }
}

const FAQElement = ({ item }: { item: FAQItem }): JSX.Element => {
    const { question, answer } = item
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
    return (
        <div
            className={`faq-item ${
                isOpen ? 'open' : ''
            } group max-w-2xl mx-auto p-6 border-2 rounded-md cursor-pointer`}
            onClick={onToggle}
        >
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className="group-hover:text-primary text-main font-semibold question">{question}</div>
                    <div className={`${isOpen ? '' : 'hidden'} answer`}>{answer}</div>
                </div>
                <div className="mt-1 group-hover:text-primary">
                    {isOpen ? <FaMinus className="text-sm " /> : <FaPlus className="text-sm" />}
                </div>
            </div>
        </div>
    )
}

const FAQ = ({ data, modifiedTime }: FAQProps): JSX.Element => {
    return (
        <div className="page-content">
            <div className="text-content">
                <h1 className="page-title-sm text-center">Frequently Asked Questions</h1>
                <div className="p-6 space-y-4">
                    {data.map((item, idx) => {
                        return <FAQElement key={`faq-${idx}`} item={item} />
                    })}
                </div>
                <div className="text-center mt-10">
                    <h2 className="text-2xl font-semibold my-4">Still Have Questions?</h2>
                    <div className="max-w-md mx-auto font-normal text-alt-2 leading-6">
                        If you cannot find the answer to your question in the FAQ, you can look in the{' '}
                        <Link href="/rulebook">
                            <span className="text-link">Rulebook</span>
                        </Link>
                        , or{' '}
                        <Link href="/contact">
                            <span className="text-link">Contact us</span>
                        </Link>
                        . We will respond shortly!
                    </div>
                </div>
            </div>
        </div>
    )
}

FAQ.SEO = {
    title: 'Frequently Asked Questions',
    url: '/faq',
}

export default FAQ

// <div className="flex flex-row">
//     <div className="w-6">Q:</div>
// <h2>{question}</h2>
// </div>
// <div className="flex flex-row">
// <div className="w-6">A:</div>
// <div>{answer}</div>
// </div>
