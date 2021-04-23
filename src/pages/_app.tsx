import 'normalize.css'
import React from 'react'
import { AppProps } from 'next/app'
// NOTE: Do not move the styles dir to the src.
// They are used by the Netlify CMS preview feature.
import '../../public/styles/global.css'
import '../../public/styles/chakra.css'
import '../styles/base.scss'

// import {AuthProvider} from "../lib/auth";
import Layout from '../components/Layout/Layout'

import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '../lib/auth'
import theme from '../lib/theme'
import Head from 'next/head'
import BasicMeta from '../components/meta/BasicMeta'
import TwitterCardMeta from '../components/meta/TwitterCardMeta'
import OpenGraphMeta from '../components/meta/OpenGraphMeta'
import config from '../lib/config'
import { LoadingProvider } from '../components/Layout/useSuspenseNavigation'

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    url: string;
}

interface SEOComponent extends React.FC {
    SEO?: SEOProps;
}

type SEOAppProps = AppProps & {
    Component: SEOComponent;
}

export default function App({ Component, pageProps }: SEOAppProps) {
    const SEO = Component.SEO
    return (
        <ChakraProvider theme={theme}>
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
                        <Component {...pageProps} />
                    </Layout>
                </AuthProvider>
            </LoadingProvider>
        </ChakraProvider>
    )
}