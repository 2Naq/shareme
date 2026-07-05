import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import { myData } from '@/constants/my_data';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { ArrowRight } from 'lucide-react';


export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      noFooter
      description={`${myData.brand_name} - Sharing knowledge`}>
      <main className="bg-white container flex flex-col justify-center items-center min-h-[60vh] text-center my-4">
        <h1 className="text-6xl text-primary">
          Welcom to {myData.brand_name}
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          Sharing knowledge
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
    </Layout >
  );
}
