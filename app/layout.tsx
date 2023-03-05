'use client';
import Layout from '@/components/Layout/index';
import Providers from '@/providers/index';
import Head from 'next/head';
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
                    <Layout>{children}</Layout>
                </Providers>
            </body>
        </html>
    );
}
