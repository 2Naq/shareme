import React from 'react';
import Layout from '@theme/Layout';
import { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <Layout
      title={translate({
        id: 'theme.NotFound.title',
        message: 'Page Not Found',
      })}>
      <main className="bg-white container flex flex-col justify-center items-center min-h-[60vh] text-center my-4">
        <h1 className="text-6xl text-primary">
          404
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          Ôi không! Ní đi lạc rồi?
        </p>

        <div className="w-full sm:max-w-[450px]">
          <img
            src={useBaseUrl('/img/dribbble_1.gif')}
            alt="404 Animation"
            className="w-full rounded-2xl"
          />
        </div>

        <Link className="inline-flex items-center justify-center gap-2 pl-4 pr-6 py-3 rounded-lg bg-black text-white font-semibold hover:opacity-90 transition-opacity no-underline w-full sm:w-auto mt-4" to="/">
          <ArrowLeft className="w-5 h-5" />
          <span className="leading-none mb-[2px]">Quay lại</span>
        </Link>
      </main>
    </Layout>
  );
}
