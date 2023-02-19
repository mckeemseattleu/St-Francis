'use client';

import { Footer, Main } from '@/components/Layout';
import Providers from '@/providers/index';
import Head from 'next/head';
import NavBar from '../components/NavBar/NavBar';
import '../styles/globals.css';

export default function RootLayout({ children }: any) {
    return (
        <html lang="en">
            <Head>
                <title>St. Francis House</title>
                <meta name="description" content="St. Francis House" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <body>
                <Providers>
                    <NavBar />
                    <Main>{children}</Main>
                    <Footer enabled />
                </Providers>
            </body>
        </html>
    );
}
