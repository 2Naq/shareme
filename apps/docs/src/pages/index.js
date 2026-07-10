import React from 'react';
import LayoutProvider from '@theme/Layout/Provider';
import Navbar from '@theme/Navbar';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import { myData } from '@/constants/my_data';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { ArrowRight } from 'lucide-react';


export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <>
      <LayoutProvider>
        <Head>
          <title>{siteConfig.title}</title>
          <meta name="description" content={`${myData.brand_name} - Sharing knowledge`} />
        </Head>

        {/* Đây là Header (Navbar) tự động render từ docusaurus.config.js */}
        <Navbar />

        {/* Tự do custom nội dung bên dưới mà không bị gò bó bởi Layout mặc định */}
        <div className="custom-layout-wrapper">
          <main className="bg-white container flex flex-col justify-center items-center min-h-[calc(100vh-60px)] text-center">
            <h1 className="text-6xl text-primary">
              Welcom to {myData.brand_name}
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Practice - Challenge - Persevere
            </p>

            <div className="w-full sm:max-w-[450px]">
              <img
                src={useBaseUrl('/img/dribbble_1.gif')}
                alt="hello"
                className="w-full rounded-2xl"
              />
            </div>
            <Link className="inline-flex items-center justify-center gap-2 pr-4 pl-6 py-3 rounded-lg bg-black text-white font-semibold hover:opacity-90 transition-opacity no-underline w-full sm:w-auto mt-4" to="/plc/intro">
              <span className="leading-none mb-[2px]">Get started</span>
              <ArrowRight className="size-5" />
            </Link>
          </main>
        </div>
      </LayoutProvider>
    </>
  );
}
