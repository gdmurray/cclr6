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

export default function App({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme}>
            <AuthProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </AuthProvider>
        </ChakraProvider>
    )
}
// {/*<AuthProvider>*/}
// {layout(<Component {...pageProps} />)}
// {/*</AuthProvider>*/}