import Head from 'next/head'
import Navigation from './Navigation'
import React from 'react'
import Footer from './Footer'

export default function Layout({ children }: React.PropsWithChildren<React.ReactNode>) {
    return (
        <div className="flex flex-col min-h-full dark:bg-dark dark:text-gray-50">
            <div className="content-wrapper flex-1">
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                    <link rel="manifest" href="/site.webmanifest" />
                    <link rel="apple-touch-icon" href="/icon.png" />
                    <meta name="theme-color" content="#fff" />
                </Head>
                <nav className="navigation">
                    <Navigation />
                </nav>
                <main
                    className="flex-1"
                    style={{
                        minHeight: '85vh',
                    }}
                >
                    {children}
                </main>
            </div>
            <Footer />
            <style jsx>{`
                @media (prefers-color-scheme: light) {
                    .content-wrapper {
                        background-image: url('/images/ccl-logo-leaf-background.svg');
                    }
                }

                @media (prefers-color-scheme: dark) {
                    .content-wrapper {
                        background-image: url('/images/ccl-logo-leaf-background-dark.svg');
                    }
                }

                .content-wrapper {
                    background-size: 2500px;
                    background-position: -1000px;
                    background-attachment: fixed;
                }

                .ccl-icon {
                    transform: scale(3);
                    left: -320px;
                    top: 221px;
                    width: 1000px;
                    z-index: 1;
                    opacity: 0.3;
                }
            `}</style>
        </div>
    )
}
