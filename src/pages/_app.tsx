import 'normalize.css'
import React from 'react'
import { AppProps } from 'next/app'
// NOTE: Do not move the styles dir to the src.
// They are used by the Netlify CMS preview feature.
import '../../public/styles/global.css'
import '../styles/chakra.css'
import '../styles/base.scss'

// import {AuthProvider} from "../lib/auth";
import Layout from '../components/Layout/Layout'

import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '@lib/auth'
import theme from '../lib/theme'
import Head from 'next/head'
import BasicMeta from '../components/meta/BasicMeta'
import TwitterCardMeta from '../components/meta/TwitterCardMeta'
import OpenGraphMeta from '../components/meta/OpenGraphMeta'
import config from '@lib/platform/config'
import { LoadingProvider } from '@components/Layout/useSuspenseNavigation'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useRouter } from 'next/router'
import useAnalytics from '@lib/firebase/useAnalytics'

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    url: string;
}

interface CCLComponent extends React.FC {
    SEO?: SEOProps;
    layout: (p: JSX.Element) => JSX.Element;
}


type CCLAppProps = AppProps & {
    Component: CCLComponent;
}

export default function App({ Component, pageProps }: CCLAppProps) {
    useAnalytics()
    const SEO = pageProps.SEO || Component.SEO
    const layout = Component.layout ?? ((p): JSX.Element => <>{p}</>)
    const paypalOptions = {
        'client-id': process.env.PAYPAL_CLIENT_ID,
        currency: 'CAD'
    }
    return (
        <ChakraProvider theme={theme}>
            <PayPalScriptProvider options={paypalOptions}>
                <LoadingProvider>
                    <AuthProvider>
                        {SEO && (
                            <Head>
                                <title>{SEO.title ? [SEO.title, config.site_title].join(' | ') : config.site_title}
                                </title>
                                <BasicMeta url={SEO.url} {...SEO} />
                                <TwitterCardMeta url={SEO.url} {...SEO} />
                                <OpenGraphMeta url={SEO.url} {...SEO} />
                            </Head>
                        )}
                        <Layout>
                            {layout(<Component {...pageProps} />)}
                        </Layout>
                    </AuthProvider>
                </LoadingProvider>
            </PayPalScriptProvider>
        </ChakraProvider>
    )
}